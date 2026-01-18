import {
  PieceType,
  Rotation,
  Piece,
  Position,
  rotateShapeCW,
  rotateShapeCCW,
  getNextRotation,
  getKickTests,
  tryRotate,
  WALL_KICK_JLSTZ,
  WALL_KICK_I,
} from './rotationSystem';

// ===== Test Helpers =====

/**
 * Create a test piece
 */
function createPiece(type: PieceType, shape: number[][], rotation: Rotation = 0): Piece {
  return {
    shape,
    color: '#FFFFFF',
    type,
    rotation,
  };
}

/**
 * Simple collision checker that always returns false (no collision)
 * This allows us to test that rotation logic properly calculates positions
 */
const noCollision = () => false;

/**
 * Collision checker that only allows specific positions
 */
function createCollisionChecker(validPositions: Set<string>) {
  return (piece: Piece, x: number, y: number) => {
    const key = `${x},${y}`;
    return !validPositions.has(key);
  };
}

// ===== Shape Rotation Tests =====

describe('Shape Rotation Functions', () => {
  test('rotateShapeCW rotates T-piece correctly', () => {
    // T-piece spawn state (rotation 0)
    const tShape0 = [
      [0, 1, 0],
      [1, 1, 1],
    ];
    
    // After 90° CW rotation (rotation 1)
    const tShape1Expected = [
      [1, 0],
      [1, 1],
      [1, 0],
    ];
    
    const result = rotateShapeCW(tShape0);
    expect(result).toEqual(tShape1Expected);
  });

  test('rotateShapeCCW rotates T-piece correctly', () => {
    const tShape0 = [
      [0, 1, 0],
      [1, 1, 1],
    ];
    
    // After 90° CCW rotation (rotation 3)
    const tShape3Expected = [
      [0, 1],
      [1, 1],
      [0, 1],
    ];
    
    const result = rotateShapeCCW(tShape0);
    expect(result).toEqual(tShape3Expected);
  });

  test('rotateShapeCW on I-piece', () => {
    const iShape0 = [[1, 1, 1, 1]];
    const iShape1Expected = [
      [1],
      [1],
      [1],
      [1],
    ];
    
    const result = rotateShapeCW(iShape0);
    expect(result).toEqual(iShape1Expected);
  });
});

// ===== Rotation State Tests =====

describe('getNextRotation', () => {
  test('clockwise rotation cycles through 0->1->2->3->0', () => {
    expect(getNextRotation(0, 1)).toBe(1);
    expect(getNextRotation(1, 1)).toBe(2);
    expect(getNextRotation(2, 1)).toBe(3);
    expect(getNextRotation(3, 1)).toBe(0);
  });

  test('counter-clockwise rotation cycles through 0->3->2->1->0', () => {
    expect(getNextRotation(0, -1)).toBe(3);
    expect(getNextRotation(3, -1)).toBe(2);
    expect(getNextRotation(2, -1)).toBe(1);
    expect(getNextRotation(1, -1)).toBe(0);
  });
});

// ===== Kick Table Tests =====

describe('Wall Kick Tables', () => {
  test('WALL_KICK_JLSTZ has all 8 rotation transitions', () => {
    const expectedKeys = [
      '0->1', '1->0', '1->2', '2->1',
      '2->3', '3->2', '3->0', '0->3',
    ];
    
    expectedKeys.forEach(key => {
      expect(WALL_KICK_JLSTZ[key]).toBeDefined();
      expect(WALL_KICK_JLSTZ[key]).toHaveLength(5);
    });
  });

  test('WALL_KICK_I has all 8 rotation transitions', () => {
    const expectedKeys = [
      '0->1', '1->0', '1->2', '2->1',
      '2->3', '3->2', '3->0', '0->3',
    ];
    
    expectedKeys.forEach(key => {
      expect(WALL_KICK_I[key]).toBeDefined();
      expect(WALL_KICK_I[key]).toHaveLength(5);
    });
  });

  test('First kick test is always [0, 0] (no offset)', () => {
    Object.values(WALL_KICK_JLSTZ).forEach(tests => {
      expect(tests[0]).toEqual([0, 0]);
    });
    
    Object.values(WALL_KICK_I).forEach(tests => {
      expect(tests[0]).toEqual([0, 0]);
    });
  });
});

describe('getKickTests', () => {
  test('T-piece uses JLSTZ table', () => {
    const tests = getKickTests('T', 0, 1);
    expect(tests).toEqual(WALL_KICK_JLSTZ['0->1']);
  });

  test('I-piece uses I table', () => {
    const tests = getKickTests('I', 0, 1);
    expect(tests).toEqual(WALL_KICK_I['0->1']);
  });

  test('O-piece returns only [0, 0]', () => {
    const tests = getKickTests('O', 0, 1);
    expect(tests).toEqual([[0, 0]]);
  });
});

// ===== T-Spin Double Bug Tests =====

describe('T-Spin Double Rotation (Bug Fix)', () => {
  /**
   * This test reproduces the bug where T-piece rotation for T-Spin Double
   * would incorrectly move the piece upward (Y -= 1).
   * 
   * The bug was caused by using simplified kick tests [[0,0], [-1,0], [1,0], [0,-1]]
   * instead of proper SRS tables. The test [0, -1] would succeed when it shouldn't,
   * causing unintended upward placement.
   * 
   * With proper SRS kick tables, the correct test sequence for 0->1 is:
   * [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]
   * 
   * This ensures the piece stays at the intended position or moves according to SRS.
   */
  test('T-piece 0->1 rotation uses correct kick test order', () => {
    const tPiece = createPiece('T', [
      [0, 1, 0],
      [1, 1, 1],
    ], 0);
    
    const position: Position = { x: 4, y: 16 };
    
    // Create a collision checker that blocks certain positions
    // We want to test that the piece doesn't incorrectly move up
    // Only allow the original position [4, 16]
    const validPositions = new Set(['4,16']);
    const collisionCheck = createCollisionChecker(validPositions);
    
    const result = tryRotate(tPiece, position, 1, collisionCheck);
    
    // Should succeed with kick test 0 (no offset)
    expect(result.success).toBe(true);
    expect(result.position.x).toBe(4);
    expect(result.position.y).toBe(16);
    expect(result.kickIndex).toBe(0);
  });

  test('T-piece 0->1 with wall on left uses correct second kick test', () => {
    const tPiece = createPiece('T', [
      [0, 1, 0],
      [1, 1, 1],
    ], 0);
    
    const position: Position = { x: 0, y: 16 };
    
    // Block position [0, 16], allow [-1, 16] (second kick test offset)
    // According to SRS, second test is [-1, 0]
    const validPositions = new Set(['-1,16']);
    const collisionCheck = createCollisionChecker(validPositions);
    
    const result = tryRotate(tPiece, position, 1, collisionCheck);
    
    expect(result.success).toBe(true);
    expect(result.position.x).toBe(-1);
    expect(result.position.y).toBe(16);
    expect(result.kickIndex).toBe(1);
  });

  test('T-piece does NOT use [0, -1] kick test early in sequence', () => {
    const tPiece = createPiece('T', [
      [0, 1, 0],
      [1, 1, 1],
    ], 0);
    
    const position: Position = { x: 4, y: 16 };
    
    // Get the actual kick tests for 0->1
    const kickTests = getKickTests('T', 0, 1);
    
    // Verify [0, -1] is NOT in the first 3 tests
    // This was the bug: simplified code tested [0, -1] as the 4th test
    // causing unintended upward movement
    expect(kickTests[0]).not.toEqual([0, -1]);
    expect(kickTests[1]).not.toEqual([0, -1]);
    expect(kickTests[2]).not.toEqual([0, -1]);
    
    // The proper SRS tests should be:
    expect(kickTests).toEqual([
      [0, 0],     // Test 1: No offset
      [-1, 0],    // Test 2: One left
      [-1, -1],   // Test 3: One left, one up
      [0, 2],     // Test 4: Two down
      [-1, 2],    // Test 5: One left, two down
    ]);
  });
});

// ===== Comprehensive Rotation Tests =====

describe('tryRotate with no collisions', () => {
  test('T-piece rotates clockwise successfully', () => {
    const tPiece = createPiece('T', [
      [0, 1, 0],
      [1, 1, 1],
    ], 0);
    
    const position: Position = { x: 4, y: 2 };
    const result = tryRotate(tPiece, position, 1, noCollision);
    
    expect(result.success).toBe(true);
    expect(result.piece.rotation).toBe(1);
    expect(result.position).toEqual({ x: 4, y: 2 });
  });

  test('T-piece rotates counter-clockwise successfully', () => {
    const tPiece = createPiece('T', [
      [0, 1, 0],
      [1, 1, 1],
    ], 0);
    
    const position: Position = { x: 4, y: 2 };
    const result = tryRotate(tPiece, position, -1, noCollision);
    
    expect(result.success).toBe(true);
    expect(result.piece.rotation).toBe(3);
    expect(result.position).toEqual({ x: 4, y: 2 });
  });

  test('I-piece rotates using I kick table', () => {
    const iPiece = createPiece('I', [[1, 1, 1, 1]], 0);
    
    const position: Position = { x: 3, y: 0 };
    const result = tryRotate(iPiece, position, 1, noCollision);
    
    expect(result.success).toBe(true);
    expect(result.piece.rotation).toBe(1);
    // I-piece should use I kick table
    expect(result.kickIndex).toBe(0);
  });

  test('O-piece always succeeds with no offset', () => {
    const oPiece = createPiece('O', [
      [1, 1],
      [1, 1],
    ], 0);
    
    const position: Position = { x: 4, y: 2 };
    const result = tryRotate(oPiece, position, 1, noCollision);
    
    expect(result.success).toBe(true);
    expect(result.piece.rotation).toBe(1);
    expect(result.position).toEqual({ x: 4, y: 2 });
    expect(result.kickIndex).toBe(0);
  });
});

describe('tryRotate with collisions', () => {
  test('Rotation fails when all kick tests collide', () => {
    const tPiece = createPiece('T', [
      [0, 1, 0],
      [1, 1, 1],
    ], 0);
    
    const position: Position = { x: 4, y: 2 };
    
    // Block all positions (always collide)
    const alwaysCollide = () => true;
    const result = tryRotate(tPiece, position, 1, alwaysCollide);
    
    expect(result.success).toBe(false);
    expect(result.piece).toEqual(tPiece); // Piece unchanged
    expect(result.position).toEqual(position); // Position unchanged
    expect(result.kickIndex).toBeUndefined();
  });

  test('Rotation succeeds on second kick test', () => {
    const tPiece = createPiece('T', [
      [0, 1, 0],
      [1, 1, 1],
    ], 0);
    
    const position: Position = { x: 4, y: 2 };
    
    // Block first test [4, 2], allow second test [3, 2] (offset [-1, 0])
    const validPositions = new Set(['3,2']);
    const collisionCheck = createCollisionChecker(validPositions);
    
    const result = tryRotate(tPiece, position, 1, collisionCheck);
    
    expect(result.success).toBe(true);
    expect(result.position).toEqual({ x: 3, y: 2 });
    expect(result.kickIndex).toBe(1);
  });
});

// ===== All Piece Types Regression Tests =====

describe('All piece types can rotate', () => {
  const pieceShapes: Record<PieceType, number[][]> = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    L: [[1, 0, 0], [1, 1, 1]],
    J: [[0, 0, 1], [1, 1, 1]],
  };

  Object.entries(pieceShapes).forEach(([type, shape]) => {
    test(`${type}-piece can rotate clockwise`, () => {
      const piece = createPiece(type as PieceType, shape, 0);
      const position: Position = { x: 4, y: 2 };
      const result = tryRotate(piece, position, 1, noCollision);
      
      expect(result.success).toBe(true);
      expect(result.piece.rotation).toBe(1);
    });

    test(`${type}-piece can rotate counter-clockwise`, () => {
      const piece = createPiece(type as PieceType, shape, 0);
      const position: Position = { x: 4, y: 2 };
      const result = tryRotate(piece, position, -1, noCollision);
      
      expect(result.success).toBe(true);
      expect(result.piece.rotation).toBe(3);
    });
  });
});

// ===== Full Rotation Cycle Tests =====

describe('Full rotation cycles', () => {
  test('T-piece completes full clockwise cycle', () => {
    let piece = createPiece('T', [
      [0, 1, 0],
      [1, 1, 1],
    ], 0);
    const position: Position = { x: 4, y: 2 };
    
    // Rotate 4 times clockwise should return to rotation 0
    for (let i = 0; i < 4; i++) {
      const result = tryRotate(piece, position, 1, noCollision);
      expect(result.success).toBe(true);
      piece = result.piece;
    }
    
    expect(piece.rotation).toBe(0);
  });

  test('T-piece completes full counter-clockwise cycle', () => {
    let piece = createPiece('T', [
      [0, 1, 0],
      [1, 1, 1],
    ], 0);
    const position: Position = { x: 4, y: 2 };
    
    // Rotate 4 times counter-clockwise should return to rotation 0
    for (let i = 0; i < 4; i++) {
      const result = tryRotate(piece, position, -1, noCollision);
      expect(result.success).toBe(true);
      piece = result.piece;
    }
    
    expect(piece.rotation).toBe(0);
  });
});
