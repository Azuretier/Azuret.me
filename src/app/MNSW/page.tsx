"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { auth, db } from "@/lib/MNSW/firebase";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { collection, query, orderBy, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { VoxelEngine, BlockType } from "@/lib/MNSW/VoxelEngine";
import PanoramaBackground from "@/components/MNSW/PanoramaBackground";
import styles from "@/styles/Home.module.css";

const COLORS: Record<string, string> = {
  grass: '#567d46', dirt: '#5d4037', stone: '#757575',
  wood: '#4e342e', brick: '#8d6e63', leaves: '#2e7d32',
  water: '#40a4df', obsidian: '#1a1a1a', sand: '#c2b280'
};

const FIXED_SPLASH = "Music by C418!";
const DEFAULT_HOTBAR: (BlockType | null)[] = ['grass', 'dirt', 'stone', 'wood', 'brick', 'leaves', 'water', 'obsidian', 'sand'];
const DEFAULT_INVENTORY: (BlockType | null)[] = new Array(27).fill(null);

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'title' | 'worlds' | 'game' | 'loading'>('title');
  const [worlds, setWorlds] = useState<any[]>([]);
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [newWorldName, setNewWorldName] = useState("New World");
  const [newWorldType, setNewWorldType] = useState<0 | 1>(0);

  const [loadingStatus, setLoadingStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const [showPreGame, setShowPreGame] = useState(false);
  const [paused, setPaused] = useState(false);
  const [coords, setCoords] = useState("0, 0, 0");
  const [sensitivity, setSensitivity] = useState(20);
  const [pauseMenuState, setPauseMenuState] = useState<'main' | 'options'>('main');

  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [hotbar, setHotbar] = useState<(BlockType | null)[]>(DEFAULT_HOTBAR);
  const [inventory, setInventory] = useState<(BlockType | null)[]>(DEFAULT_INVENTORY);
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [dragItem, setDragItem] = useState<{item: BlockType, index: number, source: 'hotbar' | 'inv'} | null>(null);
  const [cursorPos, setCursorPos] = useState({x:0, y:0});

  // isLoaded ensures we don't save empty default state over existing data
  const isLoaded = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<VoxelEngine | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u); else signInAnonymously(auth);
    });
    return () => unsub();
  }, []);

  // --- PERSISTENCE HELPERS ---
  
  // 1. Synchronous Local Save (Call this on every interaction)
  const updateLocalSave = (newInv: (BlockType | null)[], newHb: (BlockType | null)[]) => {
    if (!selectedWorldId) return;
    const data = { inventory: newInv, hotbar: newHb, updatedAt: Date.now() };
    localStorage.setItem(`mc_world_${selectedWorldId}`, JSON.stringify(data));
  };

  // 2. Async Cloud Save (Called via debounce/exit)
  const saveToFirestore = useCallback(async (currentInv: any[], currentHb: any[]) => {
    if (!user || !selectedWorldId) return;
    try {
        await setDoc(doc(db, `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/users/${user.uid}/worlds/${selectedWorldId}`), { 
            inventory: currentInv, 
            hotbar: currentHb, 
            updatedAt: Date.now() 
        }, { merge: true });
    } catch (e) { console.error("Cloud save failed", e); }
  }, [user, selectedWorldId]);

  // --- AUTO SAVE EFFECT (Cloud Only) ---
  useEffect(() => {
    if (!user || !selectedWorldId || view !== 'game' || !isLoaded.current) return;
    
    // We already saved to LocalStorage in the handler.
    // This effect is purely to sync to the Cloud periodically.
    const timeout = setTimeout(() => {
        saveToFirestore(inventory, hotbar);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [inventory, hotbar, user, selectedWorldId, view, saveToFirestore]);


  // --- ENGINE SYNC ---
  useEffect(() => { if (engineRef.current) engineRef.current.setSensitivity(sensitivity / 10000); }, [sensitivity]);
  useEffect(() => { (window as any).__SELECTED_BLOCK__ = hotbar[selectedSlot]; }, [selectedSlot, hotbar]);


  // --- INPUT HANDLERS ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (view !== 'game') return;

      if(e.code.startsWith("Digit")) {
        const idx = parseInt(e.key) - 1;
        if(idx >= 0 && idx < 9) setSelectedSlot(idx);
      }
      
      if(e.code === 'KeyE') {
        if(inventoryOpen) {
           setInventoryOpen(false);
           saveToFirestore(inventory, hotbar); // Cloud sync on close
           document.body.requestPointerLock();
           if(engineRef.current) { engineRef.current.isPaused = false; engineRef.current.isInventoryOpen = false; }
        } else {
           setInventoryOpen(true);
           document.exitPointerLock();
           if(engineRef.current) { engineRef.current.isPaused = false; engineRef.current.isInventoryOpen = true; }
        }
      }
    };
    const handleMouseMove = (e: MouseEvent) => setCursorPos({x: e.clientX, y: e.clientY});

    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousemove', handleMouseMove);
    return () => { window.removeEventListener('keydown', handleKey); window.removeEventListener('mousemove', handleMouseMove); };
  }, [view, inventoryOpen, saveToFirestore, inventory, hotbar]);


  // --- INVENTORY INTERACTION ---
  const handleSlotClick = (index: number, source: 'hotbar' | 'inv') => {
    const currentItem = source === 'hotbar' ? hotbar[index] : inventory[index];

    let newHb = [...hotbar];
    let newInv = [...inventory];

    if(!dragItem) {
      if(currentItem) {
          setDragItem({ item: currentItem, index, source });
          // Visually remove from slot
          if(source === 'hotbar') newHb[index] = null;
          else newInv[index] = null;
      } else {
          // Clicked empty slot with nothing dragging, do nothing
          return;
      }
    } else {
      const itemToDrop = dragItem.item;
      const prevSource = dragItem.source;
      const prevIndex = dragItem.index;

      // Reset to original if clicked same slot
      if (prevSource === source && prevIndex === index) {
          if (source === 'hotbar') newHb[index] = itemToDrop;
          else newInv[index] = itemToDrop;
          setDragItem(null);
          // State update happens below
      } else {
          // Place item in target
          if(source === 'hotbar') newHb[index] = itemToDrop;
          else newInv[index] = itemToDrop;
          
          // Swap logic: if target wasn't empty, put target item back in source
          if (currentItem) {
             if (prevSource === 'hotbar') newHb[prevIndex] = currentItem;
             else newInv[prevIndex] = currentItem;
          }
          setDragItem(null);
      }
    }

    // UPDATE STATE
    setHotbar(newHb);
    setInventory(newInv);

    // CRITICAL: IMMEDIATE SAVE TO LOCAL STORAGE
    // This ensures data is saved before the next repaint/reload
    updateLocalSave(newInv, newHb);
  };


  // --- POINTER LOCK ---
  useEffect(() => {
    const handleLock = () => {
      if (document.pointerLockElement === document.body) {
        setPaused(false); setInventoryOpen(false);
        if (engineRef.current) { engineRef.current.isPaused = false; engineRef.current.isInventoryOpen = false; }
      } else {
        if (inventoryOpen) {
            if (engineRef.current) { engineRef.current.isPaused = false; engineRef.current.isInventoryOpen = true; }
        } else {
            if (view === 'game' && !showPreGame) {
                setPaused(true); setPauseMenuState('main');
                if (engineRef.current) engineRef.current.isPaused = true;
            }
        }
      }
    };
    document.addEventListener('pointerlockchange', handleLock);
    return () => document.removeEventListener('pointerlockchange', handleLock);
  }, [view, showPreGame, inventoryOpen]);


  // --- LOAD / SAVE LOGIC ---
  const startLoadingSequence = (callback: () => void) => {
    setView('loading'); setProgress(0); setLoadingStatus("Initializing");
    setTimeout(() => { setProgress(50); setLoadingStatus("Generating Terrain"); }, 1000);
    setTimeout(() => { setProgress(100); setLoadingStatus("Done"); }, 2000);
    setTimeout(callback, 2500);
  };

  const fetchWorlds = async () => {
    if (!user) return;
    const q = query(collection(db, `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/users/${user.uid}/worlds`), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setWorlds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setView('worlds');
  };

  const createWorld = async () => {
    if (!user) return;
    setModalCreate(false);
    const newId = `world_${Date.now()}`;
    const seed = Math.floor(Math.random() * 65536);
    const typeStr = newWorldType === 0 ? 'default' : 'superflat';
    
    // Default Data
    const dInv = DEFAULT_INVENTORY;
    const dHb = DEFAULT_HOTBAR;

    await setDoc(doc(db, `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/users/${user.uid}/worlds/${newId}`), { 
        name: newWorldName, createdBy: user.uid, createdAt: Date.now(), seed, type: typeStr,
        inventory: dInv, hotbar: dHb
    });
    
    // Reset local storage for new world
    localStorage.removeItem(`mc_world_${newId}`);
    
    loadGame(newId, false, { seed, type: typeStr as any, inventory: dInv, hotbar: dHb });
  };

  const loadGame = async (worldId: string, skipLoading = false, directParams?: any) => {
    if (!user) return;
    
    // Block auto-save while loading
    isLoaded.current = false;
    setSelectedWorldId(worldId);

    const init = (params: any) => {
        if (engineRef.current) engineRef.current.dispose();
        if (containerRef.current) {
            engineRef.current = new VoxelEngine(containerRef.current, `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/users/${user.uid}/worlds/${worldId}`, 
                (x, y, z) => { setCoords(`${x}, ${y}, ${z}`); }, params
            );
            // Sync selection immediately
            (window as any).__SELECTED_BLOCK__ = params.hotbar ? params.hotbar[selectedSlot] : 'grass';
            
            engineRef.current.setSensitivity(sensitivity / 10000);
            setView('game'); setShowPreGame(true); setPaused(false); setPauseMenuState('main');
            
            // Allow saves now that we are live
            isLoaded.current = true;
        }
    };

    if(directParams) {
        setInventory(directParams.inventory);
        setHotbar(directParams.hotbar);
        skipLoading ? init(directParams) : startLoadingSequence(() => init(directParams));
    } else {
        // 1. Try Local Storage FIRST
        const localDataRaw = localStorage.getItem(`mc_world_${worldId}`);
        let finalInv = DEFAULT_INVENTORY;
        let finalHb = DEFAULT_HOTBAR;
        let loadedFromLocal = false;

        if (localDataRaw) {
            try {
                const ld = JSON.parse(localDataRaw);
                if (ld.inventory && ld.hotbar) {
                    finalInv = ld.inventory;
                    finalHb = ld.hotbar;
                    loadedFromLocal = true;
                }
            } catch(e) { console.warn("Corrupt local data", e); }
        }

        // 2. Fetch DB Params (Seed, Type, Inventory backup)
        const snap = await getDoc(doc(db, `artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/users/${user.uid}/worlds/${worldId}`));
        if(snap.exists()) {
            const d = snap.data();
            const params = { seed: d.seed || 0, type: d.type || 'default', inventory: finalInv, hotbar: finalHb };
            
            // If local storage was empty/missing, use DB data
            if (!loadedFromLocal) {
                finalInv = d.inventory || DEFAULT_INVENTORY;
                finalHb = d.hotbar || DEFAULT_HOTBAR;
                params.inventory = finalInv;
                params.hotbar = finalHb;
            }

            setInventory(finalInv);
            setHotbar(finalHb);
            
            skipLoading ? init(params) : startLoadingSequence(() => init(params));
        }
    }
  };

  const enterWorld = () => { setShowPreGame(false); if (engineRef.current) { engineRef.current.isRunning = true; document.body.requestPointerLock(); } };
  
  const quitGame = async () => { 
      if (engineRef.current) { engineRef.current.dispose(); engineRef.current = null; } 
      document.exitPointerLock(); 
      await saveToFirestore(inventory, hotbar);
      setView('title'); 
  };

  return (
    <main className={styles.fullScreen}>
      <div className={(view === 'title' || view === 'worlds' || view === 'loading') ? '' : styles.hidden}>
        <PanoramaBackground /> <div className={styles.vignette}></div>
      </div>
      <div ref={containerRef} className={styles.fullScreen} style={{ zIndex: 0 }} />

      {/* INVENTORY */}
      {view === 'game' && inventoryOpen && (
          <div className={styles.inventoryOverlay}>
              <div className={styles.inventoryWindow}>
                  <h2 className={styles.invTitle}>Crafting</h2>
                  
                  <div style={{display:'flex', gap:20, padding: 10, background: '#8b8b8b', border:'2px solid #373737', borderBottomColor:'#fff', borderRightColor:'#fff'}}>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:2}}>
                          {[0,1,2,3].map(i => <div key={i} className={styles.invSlot} style={{width:30, height:30}}></div>)}
                      </div>
                      <div style={{display:'flex', alignItems:'center'}}>➔</div>
                      <div className={styles.invSlot} style={{width:40, height:40}}></div>
                  </div>

                  <div className={styles.invSection}>
                      <span className={styles.invLabel}>Inventory</span>
                      <div className={styles.invGrid}>
                          {inventory.map((item, idx) => (
                              <div key={idx} className={styles.invSlot} onClick={() => handleSlotClick(idx, 'inv')}>
                                  {item && <div className={styles.itemIcon} style={{backgroundColor: COLORS[item]}} />}
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className={styles.invSection}>
                      <span className={styles.invLabel}>Hotbar</span>
                      <div className={styles.invGrid}>
                          {hotbar.map((item, idx) => (
                              <div key={idx} className={styles.invSlot} onClick={() => handleSlotClick(idx, 'hotbar')}>
                                   {item && <div className={styles.itemIcon} style={{backgroundColor: COLORS[item]}} />}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* DRAG ITEM */}
      {dragItem && (
          <div className={styles.dragItem} style={{top: cursorPos.y - 20, left: cursorPos.x - 20}}>
             <div className={styles.itemIcon} style={{backgroundColor: COLORS[dragItem.item], width:40, height:40}} />
          </div>
      )}

      {/* TITLE */}
      {view === 'title' && (
        <div className={styles.fullScreen}>
          <div className={styles.menuLayer}>
            <div className={styles.logoContainer}>
              <h1 className={styles.logoMain}>MINECRAFT</h1>
              <div className={styles.logoSub}>NINTENDO SWITCH EDITION</div>
            </div>
            <div className={styles.menuContainer}>
              <button disabled={!user} onClick={fetchWorlds} className={styles.switchBtn}>Play Game</button>
              <button className={styles.switchBtn}>Mini Games</button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING */}
      {view === 'loading' && (
        <div className={`${styles.fullScreen} ${styles.loadingScreen}`}>
          <div className={styles.loadingOverlay}>
            <h1 className={styles.loadingLogo}>MINECRAFT</h1>
            <div className={styles.loadingCenter}>
                <div className={styles.loadingStatus}>{loadingStatus}</div>
                <div className={styles.progressTrack}><div className={styles.progressFill} style={{width:`${progress}%`}}></div></div>
            </div>
          </div>
        </div>
      )}

      {/* WORLDS */}
      {view === 'worlds' && (
        <div className={styles.fullScreen}>
          <div className={styles.menuLayer}>
            <h1 className={styles.logoMain} style={{fontSize: '4rem', marginTop: 20}}>SELECT WORLD</h1>
            <div className={styles.listContainer}>
              {worlds.map(w => (
                <div key={w.id} onClick={() => setSelectedWorldId(w.id)} className={`${styles.worldRow} ${selectedWorldId === w.id ? styles.worldRowSelected : ''}`}>
                  <span>{w.name}</span><span>{new Date(w.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
            <div className={styles.row}>
                <button onClick={() => setModalCreate(true)} className={styles.switchBtn} style={{width:'200px'}}>Create New</button>
                <button disabled={!selectedWorldId} onClick={() => loadGame(selectedWorldId!)} className={styles.switchBtn} style={{width:'200px'}}>Load</button>
            </div>
            <button onClick={() => setView('title')} className={styles.switchBtn} style={{width:'200px', marginTop:20}}>Back</button>
          </div>
        </div>
      )}

      {/* CREATE */}
      {modalCreate && (
        <div className={`${styles.fullScreen} ${styles.flexCenter} ${styles.bgOverlay}`}>
          <div className={styles.modalBox}>
            <h2 style={{fontSize: '2rem'}}>CREATE NEW WORLD</h2>
            <input value={newWorldName} onChange={(e) => setNewWorldName(e.target.value)} className={styles.input} placeholder="Name" />
            <div className={styles.sliderContainer} style={{width: '95%', marginBottom: 30}}>
                <input type="range" min="0" max="1" step="1" value={newWorldType} onChange={(e) => setNewWorldType(parseInt(e.target.value) as 0|1)} className={styles.sliderInput} />
                <div className={styles.sliderLabel}>Type: {newWorldType === 0 ? 'DEFAULT' : 'SUPERFLAT'}</div>
            </div>
            <div className={styles.row}>
              <button onClick={createWorld} className={styles.switchBtn}>Create</button>
              <button onClick={() => setModalCreate(false)} className={styles.switchBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* PRE GAME */}
      {view === 'game' && showPreGame && (
        <div className={`${styles.fullScreen} ${styles.flexCenter} ${styles.bgOverlay}`}>
          <h1 style={{fontFamily: 'var(--font-pixel)', fontSize: '4rem', color: '#4CAF50', textShadow: '2px 2px 0 #000'}}>READY!</h1>
          <button onClick={enterWorld} className={styles.switchBtn} style={{width: '300px'}}>START GAME</button>
        </div>
      )}

      {/* PAUSE MENU */}
      {view === 'game' && paused && !showPreGame && !inventoryOpen && (
        <div className={`${styles.fullScreen} ${styles.flexCenter} ${styles.bgOverlay}`}>
          <h1 style={{fontFamily: 'var(--font-pixel)', fontSize: '4rem', marginBottom: '1rem', textShadow: '2px 2px 0 #000'}}>
            {pauseMenuState === 'main' ? 'GAME PAUSED' : 'OPTIONS'}
          </h1>
          <div className={styles.menuContainer}>
            {pauseMenuState === 'main' && (
                <>
                    <button onClick={() => document.body.requestPointerLock()} className={styles.switchBtn}>Resume Game</button>
                    <button onClick={() => setPauseMenuState('options')} className={styles.switchBtn}>Options</button>
                    <button onClick={quitGame} className={styles.switchBtn}>Save & Quit</button>
                </>
            )}
            {pauseMenuState === 'options' && (
                <>
                    <div className={styles.sliderContainer}>
                        <input type="range" min="1" max="200" value={sensitivity} onChange={(e) => setSensitivity(parseInt(e.target.value))} className={styles.sliderInput} />
                        <div className={styles.sliderLabel}>Sensitivity: {sensitivity}%</div>
                    </div>
                    <button onClick={() => setPauseMenuState('main')} className={styles.switchBtn}>Back</button>
                </>
            )}
          </div>
        </div>
      )}

      {/* HUD */}
      {view === 'game' && !showPreGame && !inventoryOpen && (
        <div className={`${styles.fullScreen} ${styles.hudLayer}`}>
          <div className={styles.crosshair}></div>
          <div className={styles.coords}>{coords}</div>
          <div className={styles.hotbar}>
            {hotbar.map((item, idx) => (
              <div key={idx} onClick={() => setSelectedSlot(idx)} className={`${styles.slot} ${selectedSlot === idx ? styles.slotActive : ''}`}>
                 {item && <div style={{width:'100%', height:'100%', backgroundColor: COLORS[item]}}></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}