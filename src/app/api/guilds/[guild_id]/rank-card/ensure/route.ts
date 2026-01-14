import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/rank-card/firebase-admin';
import { normalizeDisplayName, generateCardId } from '@/lib/rank-card/utils';

interface Member {
  displayName: string;
  displayNameKey?: string;
  level: number;
  xp: number;
  rankName?: string;
  avatarUrl?: string;
  avaterUrl?: string; // Support legacy typo in existing data
}

interface RankCard {
  status: 'ready' | 'not_found' | 'ambiguous' | 'error';
  displayNameOriginal: string;
  displayNameKey: string;
  memberId?: string;
  level?: number;
  xp?: number;
  xpToNext?: number;
  rankName?: string;
  avatarUrl?: string;
  updatedAt: string;
  candidates?: Array<{
    memberId: string;
    displayName: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { guild_id: string } }
) {
  try {
    const { displayNameOriginal } = await request.json();
    
    if (!displayNameOriginal || typeof displayNameOriginal !== 'string') {
      return NextResponse.json(
        { error: 'displayNameOriginal is required and must be a string' },
        { status: 400 }
      );
    }

    // Normalize the display name for lookup
    const displayNameKey = normalizeDisplayName(displayName);
    const cardId = await generateCardId(guildId, displayNameKey);
    const db = getAdminFirestore();

    // Query members collection by displayNameKey (preferred) or displayName (fallback)
    const membersRef = db.collection(`guilds/${guildId}/members`);
    
    // Try querying by displayNameKey first
    let membersSnapshot = await membersRef
      .where('displayNameKey', '==', displayNameKey)
      .get();

    // Fallback to displayName if displayNameKey doesn't exist or no results
    if (membersSnapshot.empty) {
      membersSnapshot = await membersRef
        .where('displayName', '==', displayName)
        .get();
    }

    // Handle not found
    if (membersSnapshot.empty) {
      const rankCardRef = db.doc(`guilds/${guildId}/rankCards/${cardId}`);
      
      await rankCardRef.set({
        guildId,
        displayName,
        displayNameKey,
        status: 'not_found',
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      return NextResponse.json({
        status: 'not_found',
        cardId,
        message: 'Member not found'
      });
    }

    // Handle ambiguous (multiple matches)
    if (membersSnapshot.size > 1) {
      const candidates = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        displayName: doc.data().displayName,
        level: doc.data().level,
        xp: doc.data().xp,
      }));

      const rankCardRef = db.doc(`guilds/${guildId}/rankCards/${cardId}`);
      
      await rankCardRef.set({
        guildId,
        displayName,
        displayNameKey,
        status: 'ambiguous',
        candidates,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      return NextResponse.json({
        status: 'ambiguous',
        cardId,
        candidates,
        message: 'Multiple members found with this display name'
      });
    }

    // Single match found - success case
    const memberDoc = membersSnapshot.docs[0];
    const memberData = memberDoc.data();
    
    const rankCardRef = db.doc(`guilds/${guildId}/rankCards/${cardId}`);

    // Handle avatar field (might be avatarUrl or misspelled avaterUrl)
    // TODO: Once all data is migrated to use 'avatarUrl', remove the 'avaterUrl' fallback
    const avatarUrl = memberData.avatarUrl || memberData.avaterUrl || null;

    await rankCardRef.set({
      guildId,
      memberId: memberDoc.id,
      displayName: memberData.displayName,
      displayNameKey,
      level: memberData.level || 0,
      xp: memberData.xp || 0,
      rankName: memberData.rankName || null,
      avatarUrl,
      status: 'found',
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({
      status: 'found',
      cardId,
      data: {
        displayName: memberData.displayName,
        level: memberData.level || 0,
        xp: memberData.xp || 0,
        rankName: memberData.rankName || null,
        avatarUrl,
      }
    });

  } catch (error) {
    console.error('Error in rank-card ensure endpoint:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
    const guildId = params.guild_id;
    const displayNameKey = normalizeDisplayName(displayNameOriginal);
    const cardId = generateCardId(guildId, displayNameKey);

    const db = getAdminDb();
    const membersRef = db.collection(`guilds/${guildId}/members`);
    
    // Try to find members by displayNameKey first, then fallback to exact displayName match
    let membersSnapshot = await membersRef
      .where('displayNameKey', '==', displayNameKey)
      .get();
    
    // Fallback to displayName if no displayNameKey matches
    if (membersSnapshot.empty) {
      membersSnapshot = await membersRef
        .where('displayName', '==', displayNameOriginal)
        .get();
    }

    const rankCardRef = db.doc(`guilds/${guildId}/rankCards/${cardId}`);
    
    if (membersSnapshot.empty) {
      // No member found
      const notFoundCard: RankCard = {
        status: 'not_found',
        displayNameOriginal,
        displayNameKey,
        updatedAt: new Date().toISOString(),
      };
      
      await rankCardRef.set(notFoundCard);
      
      return NextResponse.json({
        cardId,
        status: 'not_found',
      });
    }

    if (membersSnapshot.size > 1) {
      // Multiple members found - ambiguous
      const candidates = membersSnapshot.docs.map(doc => ({
        memberId: doc.id,
        displayName: doc.data().displayName,
      }));
      
      const ambiguousCard: RankCard = {
        status: 'ambiguous',
        displayNameOriginal,
        displayNameKey,
        candidates,
        updatedAt: new Date().toISOString(),
      };
      
      await rankCardRef.set(ambiguousCard);
      
      return NextResponse.json({
        cardId,
        status: 'ambiguous',
        candidates,
      });
    }

    // Single member found - ready
    const memberDoc = membersSnapshot.docs[0];
    const memberData = memberDoc.data() as Member;
    
    // Calculate XP to next level (simple formula: level * 100)
    // Ensure xpToNext is never negative
    const xpToNext = Math.max(0, (memberData.level + 1) * 100 - memberData.xp);
    
    // Support both avatarUrl and avaterUrl (legacy typo)
    // Prefer avatarUrl if both are present
    const avatarUrl = memberData.avatarUrl || memberData.avaterUrl;
    
    const readyCard: RankCard = {
      status: 'ready',
      displayNameOriginal,
      displayNameKey,
      memberId: memberDoc.id,
      level: memberData.level,
      xp: memberData.xp,
      xpToNext,
      rankName: memberData.rankName,
      avatarUrl,
      updatedAt: new Date().toISOString(),
    };
    
    await rankCardRef.set(readyCard);
    
    return NextResponse.json({
      cardId,
      status: 'ready',
      data: readyCard,
    });
    
  } catch (error) {
    console.error('Error in ensure rank card:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
