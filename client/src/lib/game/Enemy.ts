import { GameObject } from './GameObject';

export class Enemy extends GameObject {
  private speed: number;
  private sprite: HTMLImageElement | null;
  private spriteLoaded: boolean;
  private direction: number;
  private lastDirectionChange: number;
  private health: number;
  private maxHealth: number;

  constructor(x: number, y: number) {
    super(x, y, 32, 32);
    this.speed = 50 + Math.random() * 100; // Random speed between 50-150
    this.sprite = null;
    this.spriteLoaded = false;
    this.direction = Math.random() > 0.5 ? 1 : -1;
    this.lastDirectionChange = Date.now();
    this.health = 1;
    this.maxHealth = 1;
    this.loadSprite();
  }

  private loadSprite(): void {
    this.sprite = new Image();
    this.sprite.onload = () => {
      this.spriteLoaded = true;
      console.log("Enemy sprite loaded");
    };
    this.sprite.onerror = () => {
      console.warn("Enemy sprite failed to load, using fallback");
      this.spriteLoaded = false;
    };
    this.sprite.src = '/sprites/enemy.svg';
  }

  public update(deltaTime: number): void {
    // Move down slowly
    this.y += this.speed * 0.5 * (deltaTime / 1000);
    
    // Move horizontally with direction changes
    const now = Date.now();
    if (now - this.lastDirectionChange > 2000) { // Change direction every 2 seconds
      this.direction *= -1;
      this.lastDirectionChange = now;
    }
    
    this.x += this.direction * this.speed * (deltaTime / 1000);
    
    // Bounce off screen edges
    if (this.x <= 0 || this.x >= 800 - this.width) {
      this.direction *= -1;
      this.x = Math.max(0, Math.min(800 - this.width, this.x));
    }
    
    // Remove if off screen (bottom)
    if (this.y > 600) {
      this.destroy();
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.spriteLoaded && this.sprite) {
      // Draw the enemy sprite
      ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      // Fallback rendering - menacing enemy
      ctx.fillStyle = '#8B0000';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      // Dark center
      ctx.fillStyle = '#2F1B14';
      ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);
      
      // Menacing eyes
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(this.x + 8, this.y + 10, 3, 0, Math.PI * 2);
      ctx.arc(this.x + this.width - 8, this.y + 10, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // White eye centers
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(this.x + 8, this.y + 10, 1, 0, Math.PI * 2);
      ctx.arc(this.x + this.width - 8, this.y + 10, 1, 0, Math.PI * 2);
      ctx.fill();
      
      // Weapon ports
      ctx.fillStyle = '#FF4500';
      ctx.fillRect(this.x + 4, this.y + this.height - 6, 4, 4);
      ctx.fillRect(this.x + this.width - 8, this.y + this.height - 6, 4, 4);
    }

    // Add red glow effect for enemies
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 3;
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
    ctx.shadowBlur = 0;
  }

  public takeDamage(damage: number): boolean {
    this.health -= damage;
    if (this.health <= 0) {
      this.destroy();
      return true; // Enemy destroyed
    }
    return false; // Enemy still alive
  }

  public getPoints(): number {
    return 100; // Base points for destroying this enemy
  }
}
