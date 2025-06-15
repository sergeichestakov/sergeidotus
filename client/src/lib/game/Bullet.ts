import { GameObject } from './GameObject';

export class Bullet extends GameObject {
  private speed: number;
  private sprite: HTMLImageElement | null;
  private spriteLoaded: boolean;
  public isPlayerBullet: boolean;

  constructor(x: number, y: number, isPlayerBullet: boolean = true) {
    super(x, y, 8, 16);
    this.speed = isPlayerBullet ? 500 : 200; // Player bullets faster than enemy bullets
    this.sprite = null;
    this.spriteLoaded = false;
    this.isPlayerBullet = isPlayerBullet;
    this.loadSprite();
  }

  private loadSprite(): void {
    this.sprite = new Image();
    this.sprite.onload = () => {
      this.spriteLoaded = true;
      console.log("Bullet sprite loaded");
    };
    this.sprite.onerror = () => {
      console.warn("Bullet sprite failed to load, using fallback");
      this.spriteLoaded = false;
    };
    this.sprite.src = '/sprites/bullet.svg';
  }

  public update(deltaTime: number): void {
    if (this.isPlayerBullet) {
      // Player bullets move up
      this.y -= this.speed * (deltaTime / 1000);
      
      // Remove if off screen (top)
      if (this.y + this.height < 0) {
        this.destroy();
      }
    } else {
      // Enemy bullets move down
      this.y += this.speed * (deltaTime / 1000);
      
      // Remove if off screen (bottom)
      if (this.y > 600) {
        this.destroy();
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.spriteLoaded && this.sprite && this.isPlayerBullet) {
      // Draw patriotic bullet sprite for player
      ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      // Fallback rendering
      if (this.isPlayerBullet) {
        // Patriotic player bullet
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#4169E1'); // Blue
        gradient.addColorStop(0.5, '#FFFFFF'); // White
        gradient.addColorStop(1, '#DC143C'); // Red
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add glow
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 3;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
      } else {
        // Enemy bullet - dark and menacing
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 2;
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
      }
    }
  }
}
