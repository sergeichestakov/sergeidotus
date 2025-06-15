import { Player } from './Player';
import { Enemy } from './Enemy';
import { Bullet } from './Bullet';
import { Particle } from './Particle';
import { GameObject } from './GameObject';
import { useGameStats } from '../stores/useGameStats';
import { useGame } from '../stores/useGame';
import { useAudio } from '../stores/useAudio';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private enemies: Enemy[];
  private bullets: Bullet[];
  private particles: Particle[];
  private keys: { [key: string]: boolean };
  private lastTime: number;
  private isRunning: boolean;
  private backgroundImage: HTMLImageElement | null;
  private lastEnemySpawn: number;
  private enemySpawnRate: number;
  private gameStats: any;
  private gameState: any;
  private audioState: any;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.player = new Player(400, 500);
    this.enemies = [];
    this.bullets = [];
    this.particles = [];
    this.keys = {};
    this.lastTime = 0;
    this.isRunning = false;
    this.backgroundImage = null;
    this.lastEnemySpawn = 0;
    this.enemySpawnRate = 2000; // Spawn enemy every 2 seconds initially

    // Get store states
    this.gameStats = useGameStats.getState();
    this.gameState = useGame.getState();
    this.audioState = useAudio.getState();

    this.setupCanvas();
    this.setupInput();
    this.loadBackground();

    console.log("GameEngine initialized");
  }

  private setupCanvas(): void {
    // Set canvas size
    this.canvas.width = 800;
    this.canvas.height = 600;
    
    // Enable image smoothing for better sprite rendering
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  private setupInput(): void {
    // Keyboard event listeners
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      
      // Handle mute toggle
      if (e.key === 'm' || e.key === 'M') {
        this.audioState.toggleMute();
      }
      
      console.log(`Key pressed: ${e.key}`);
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });

    // Prevent context menu on right click
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  private loadBackground(): void {
    this.backgroundImage = new Image();
    this.backgroundImage.onload = () => {
      console.log("Background loaded");
    };
    this.backgroundImage.onerror = () => {
      console.warn("Background failed to load");
    };
    this.backgroundImage.src = '/sprites/flag-bg.svg';
  }

  public start(): void {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
    console.log("Game loop started");
  }

  public stop(): void {
    this.isRunning = false;
    console.log("Game loop stopped");
  }

  private gameLoop = (currentTime: number = performance.now()): void => {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    // Get fresh state data
    const currentStats = useGameStats.getState();
    const currentGameState = useGame.getState();
    
    // Update player
    this.handleInput(deltaTime);
    this.player.update(deltaTime);

    // Spawn enemies
    this.spawnEnemies(deltaTime);

    // Update enemies
    this.enemies = this.enemies.filter(enemy => {
      enemy.update(deltaTime);
      
      // Check if enemy reached the player area (lose life)
      if (enemy.y + enemy.height >= this.player.y) {
        currentStats.loseLife();
        this.audioState.playHit();
        
        // Create explosion particles
        const explosionParticles = Particle.createExplosion(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          15,
          ['#FF0000', '#FF4500', '#FFD700']
        );
        this.particles.push(...explosionParticles);
        
        console.log(`Enemy reached player! Lives remaining: ${currentStats.lives - 1}`);
        
        return false; // Remove enemy
      }
      
      return enemy.active;
    });

    // Update bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.update(deltaTime);
      return bullet.active;
    });

    // Update particles
    this.particles = this.particles.filter(particle => {
      particle.update(deltaTime);
      return particle.active;
    });

    // Check collisions
    this.checkCollisions();

    // Check game over condition - get fresh lives count
    const freshStats = useGameStats.getState();
    if (freshStats.lives <= 0) {
      console.log("Game Over! Lives exhausted.");
      currentGameState.end();
      this.stop();
    }

    // Increase difficulty over time
    this.adjustDifficulty();
  }

  private handleInput(deltaTime: number): void {
    // Player movement
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      this.player.moveLeft(deltaTime);
    }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.player.moveRight(deltaTime, this.canvas.width);
    }

    // Player shooting
    if (this.keys[' '] && this.player.canShoot()) {
      const shootPos = this.player.getShootPosition();
      const bullet = new Bullet(shootPos.x - 4, shootPos.y, true);
      this.bullets.push(bullet);
      this.player.shoot();
      
      // Play shooting sound (if not muted)
      if (!this.audioState.isMuted) {
        // Create a quick shooting sound effect
        console.log("Player shoots!");
      }
    }
  }

  private spawnEnemies(deltaTime: number): void {
    const now = Date.now();
    if (now - this.lastEnemySpawn >= this.enemySpawnRate) {
      // Spawn enemy at random x position
      const x = Math.random() * (this.canvas.width - 32);
      const enemy = new Enemy(x, -32);
      this.enemies.push(enemy);
      this.lastEnemySpawn = now;
      
      console.log(`Enemy spawned at x: ${x}`);
    }
  }

  private checkCollisions(): void {
    const currentStats = useGameStats.getState();
    
    // Player bullets vs enemies
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      if (!bullet.isPlayerBullet) continue;

      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        
        if (bullet.collidesWith(enemy)) {
          // Enemy hit!
          currentStats.addScore(enemy.getPoints());
          
          // Create explosion particles
          const explosionParticles = Particle.createExplosion(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2,
            12,
            ['#FF0000', '#FF4500', '#FFD700', '#FFFFFF']
          );
          this.particles.push(...explosionParticles);
          
          // Play hit sound
          this.audioState.playHit();
          
          // Remove bullet and enemy
          this.bullets.splice(i, 1);
          this.enemies.splice(j, 1);
          
          console.log(`Enemy destroyed! Score: ${currentStats.score}`);
          break;
        }
      }
    }

    // Enemies vs player
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      
      if (enemy.collidesWith(this.player)) {
        // Player hit by enemy!
        currentStats.loseLife();
        
        // Create explosion particles
        const explosionParticles = Particle.createExplosion(
          this.player.x + this.player.width / 2,
          this.player.y + this.player.height / 2,
          20,
          ['#FF0000', '#FF4500', '#FFD700']
        );
        this.particles.push(...explosionParticles);
        
        // Play hit sound
        this.audioState.playHit();
        
        // Remove enemy
        this.enemies.splice(i, 1);
        
        console.log(`Player hit by collision! Lives remaining: ${currentStats.lives - 1}`);
      }
    }
  }

  private adjustDifficulty(): void {
    // Increase spawn rate based on score
    const baseSpawnRate = 2000;
    const score = this.gameStats.score;
    this.enemySpawnRate = Math.max(500, baseSpawnRate - (score / 100) * 50);
  }

  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    if (this.backgroundImage && this.backgroundImage.complete) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    } else {
      // Fallback patriotic background
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, '#1e3a8a'); // Dark blue
      gradient.addColorStop(0.5, '#0f172a'); // Very dark
      gradient.addColorStop(1, '#1e3a8a'); // Dark blue
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Add some stars
      this.ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 100; i++) {
        const x = (i * 37) % this.canvas.width;
        const y = (i * 47) % this.canvas.height;
        this.ctx.beginPath();
        this.ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Render all game objects
    this.particles.forEach(particle => particle.render(this.ctx));
    this.bullets.forEach(bullet => bullet.render(this.ctx));
    this.enemies.forEach(enemy => enemy.render(this.ctx));
    this.player.render(this.ctx);

    // Debug info (remove in production)
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '12px monospace';
    this.ctx.fillText(`Enemies: ${this.enemies.length}`, 10, this.canvas.height - 60);
    this.ctx.fillText(`Bullets: ${this.bullets.length}`, 10, this.canvas.height - 45);
    this.ctx.fillText(`Particles: ${this.particles.length}`, 10, this.canvas.height - 30);
    this.ctx.fillText(`FPS: ${Math.round(1000 / (performance.now() - this.lastTime))}`, 10, this.canvas.height - 15);
  }
}
