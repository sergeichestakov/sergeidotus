import { GameObject } from './GameObject';

export class Particle extends GameObject {
  private velocityX: number;
  private velocityY: number;
  private life: number;
  private maxLife: number;
  private color: string;

  constructor(x: number, y: number, color: string = '#FFFFFF') {
    super(x, y, 2, 2);
    this.velocityX = (Math.random() - 0.5) * 200; // Random horizontal velocity
    this.velocityY = (Math.random() - 0.5) * 200; // Random vertical velocity
    this.life = 1000; // 1 second life
    this.maxLife = this.life;
    this.color = color;
  }

  public update(deltaTime: number): void {
    // Update position
    this.x += this.velocityX * (deltaTime / 1000);
    this.y += this.velocityY * (deltaTime / 1000);
    
    // Reduce life
    this.life -= deltaTime;
    
    // Apply gravity effect
    this.velocityY += 100 * (deltaTime / 1000);
    
    // Apply air resistance
    this.velocityX *= 0.98;
    this.velocityY *= 0.98;
    
    // Remove when life expires
    if (this.life <= 0) {
      this.destroy();
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const alpha = this.life / this.maxLife;
    
    // Set alpha based on remaining life
    ctx.globalAlpha = alpha;
    
    // Draw particle
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Add glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 3;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;
    
    // Reset alpha
    ctx.globalAlpha = 1;
  }

  // Static method to create explosion particles
  public static createExplosion(x: number, y: number, count: number = 10, colors: string[] = ['#FF0000', '#FF4500', '#FFD700', '#FFFFFF']): Particle[] {
    const particles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const particle = new Particle(x, y, color);
      particles.push(particle);
    }
    
    return particles;
  }
}
