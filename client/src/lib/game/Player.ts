import { GameObject } from './GameObject';

export class Player extends GameObject {
  private speed: number;
  private lastShotTime: number;
  private shotCooldown: number;
  private sprite: HTMLImageElement | null;
  private spriteLoaded: boolean;

  constructor(x: number, y: number) {
    super(x, y, 48, 48);
    this.speed = 300; // pixels per second
    this.lastShotTime = 0;
    this.shotCooldown = 250; // milliseconds between shots
    this.sprite = null;
    this.spriteLoaded = false;
    this.loadSprite();
  }

  private loadSprite(): void {
    this.sprite = new Image();
    this.sprite.onload = () => {
      this.spriteLoaded = true;
      console.log("Player eagle sprite loaded");
    };
    this.sprite.onerror = () => {
      console.warn("Player sprite failed to load, using fallback");
      this.spriteLoaded = false;
    };
    this.sprite.src = '/sprites/eagle.svg';
  }

  public update(deltaTime: number): void {
    // Player movement is handled by GameEngine based on input
    // Keep player within screen bounds
    this.x = Math.max(0, Math.min(this.x, 800 - this.width));
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (this.spriteLoaded && this.sprite) {
      // Draw the eagle sprite
      ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      // Fallback rendering - patriotic eagle
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      
      // Add some patriotic colors
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(this.x + 8, this.y + 20, this.width - 16, 8);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.x + 8, this.y + 22, this.width - 16, 4);
      ctx.fillStyle = '#0000FF';
      ctx.fillRect(this.x + 8, this.y + 20, 12, 8);
      
      // Eagle eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(this.x + this.width/2 - 4, this.y + 12, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Beak
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(this.x + this.width/2, this.y + 8);
      ctx.lineTo(this.x + this.width/2 + 6, this.y + 12);
      ctx.lineTo(this.x + this.width/2, this.y + 16);
      ctx.fill();
    }

    // Add a slight glow effect
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
    ctx.shadowBlur = 0;
  }

  public moveLeft(deltaTime: number): void {
    this.x -= this.speed * (deltaTime / 1000);
    this.x = Math.max(0, this.x);
  }

  public moveRight(deltaTime: number, screenWidth: number): void {
    this.x += this.speed * (deltaTime / 1000);
    this.x = Math.min(screenWidth - this.width, this.x);
  }

  public canShoot(): boolean {
    const now = Date.now();
    return now - this.lastShotTime >= this.shotCooldown;
  }

  public shoot(): void {
    this.lastShotTime = Date.now();
  }

  public getShootPosition(): { x: number; y: number } {
    return {
      x: this.x + this.width / 2,
      y: this.y
    };
  }
}
