import { useState, useCallback } from 'react';
import { Projectile, HitSpark } from '@/types/gameTypes';

export const useProjectileSystem = () => {
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [hitSparks, setHitSparks] = useState<HitSpark[]>([]);

  const createProjectile = useCallback((
    x: number,
    y: number,
    direction: 'left' | 'right',
    type: 'fireball' | 'soundwave' | 'energy',
    owner: string,
    speed: number = 8,
    damage: number = 25,
    color: string = 'hsl(180, 100%, 50%)'
  ): Projectile => {
    const velocityX = direction === 'right' ? speed : -speed;
    
    return {
      id: `projectile-${Date.now()}-${Math.random()}`,
      x,
      y,
      width: type === 'fireball' ? 40 : type === 'soundwave' ? 60 : 30,
      height: type === 'fireball' ? 20 : type === 'soundwave' ? 30 : 20,
      velocityX,
      velocityY: 0,
      damage,
      owner,
      color,
      type,
      life: 120, // 2 seconds at 60fps
      maxLife: 120,
      hitbox: {
        x,
        y,
        width: type === 'fireball' ? 40 : type === 'soundwave' ? 60 : 30,
        height: type === 'fireball' ? 20 : type === 'soundwave' ? 30 : 20
      }
    };
  }, []);

  const addProjectile = useCallback((projectile: Projectile) => {
    setProjectiles(prev => [...prev, projectile]);
  }, []);

  const createHitSpark = useCallback((
    x: number,
    y: number,
    type: 'impact' | 'block' | 'critical' = 'impact',
    color: string = 'hsl(0, 100%, 60%)'
  ) => {
    const spark: HitSpark = {
      id: `spark-${Date.now()}-${Math.random()}`,
      x,
      y,
      size: type === 'critical' ? 20 : type === 'block' ? 15 : 10,
      color,
      life: 15,
      maxLife: 15,
      type
    };

    setHitSparks(prev => [...prev, spark]);
  }, []);

  const updateProjectiles = useCallback(() => {
    setProjectiles(prev => {
      return prev
        .map(projectile => ({
          ...projectile,
          x: projectile.x + projectile.velocityX,
          y: projectile.y + projectile.velocityY,
          life: projectile.life - 1,
          hitbox: {
            x: projectile.x + projectile.velocityX,
            y: projectile.y + projectile.velocityY,
            width: projectile.width,
            height: projectile.height
          }
        }))
        .filter(projectile => 
          projectile.life > 0 && 
          projectile.x > -100 && 
          projectile.x < 1124 && // Canvas width + buffer
          projectile.y > -50 && 
          projectile.y < 626 // Canvas height + buffer
        );
    });
  }, []);

  const updateHitSparks = useCallback(() => {
    setHitSparks(prev => {
      return prev
        .map(spark => ({
          ...spark,
          life: spark.life - 1,
          size: spark.size * 0.95 // Shrink over time
        }))
        .filter(spark => spark.life > 0);
    });
  }, []);

  const checkProjectileCollision = useCallback((rect1: any, rect2: any): boolean => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);

  const removeProjectile = useCallback((id: string) => {
    setProjectiles(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearAllProjectiles = useCallback(() => {
    setProjectiles([]);
    setHitSparks([]);
  }, []);

  return {
    projectiles,
    hitSparks,
    createProjectile,
    addProjectile,
    createHitSpark,
    updateProjectiles,
    updateHitSparks,
    checkProjectileCollision,
    removeProjectile,
    clearAllProjectiles
  };
};