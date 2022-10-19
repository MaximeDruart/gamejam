import { enemyData } from "../enemyData"
import { ranges } from "../constants"
const { MELEE, RANGED } = ranges
import { Bullet } from "./bullet"

class Enemy extends Phaser.Physics.Arcade.Image {
  // voir avec maxime si enemy = chaser ou si autre classe EnemyChaser qui extend Enemy
  constructor(scene, x, y, name) {
    super(scene, x, y, "turret")
    this.targetPosition = null

    this.stats = enemyData.find((enemy) => enemy.name === name)

    if (this.stats.range === RANGED) {
      this.bullets = scene.physics.add.group({ classType: Bullet, maxSize: 100, runChildUpdate: true })
      this.shootInterval = setInterval(this.rangeAttack.bind(this), this.stats.attackDelay * 1000)
    }
  }

  setTargetPosition(base) {
    this.targetPosition = { x: base.x, y: base.y }
  }

  update(time, delta) {
    this.goTowardsBase()
  }

  goTowardsBase() {
    const direction = new Phaser.Math.Vector2().setFromObject(this.targetPosition).subtract(this)

    let speed = this.stats.speed
    if (this.stats.range === RANGED && direction.length() < 800) {
      speed *= 0.3
    }
    direction.normalize().scale(speed)

    this.body.setVelocity(direction.x, direction.y)
  }

  kill() {
    if (this.stats.range === RANGED) {
      clearInterval(this.shootInterval)
      this.bullets.clear(true, true)
    }
    this.setActive(false)
    this.setVisible(false)
    this.body.stop()
  }

  rangeAttack() {
    const bullet = this.bullets.get()
    if (bullet) {
      let bulletDirection = new Phaser.Math.Vector2().setFromObject(this.targetPosition).subtract(this).normalize()
      bullet.fire({ x: this.x, y: this.y }, bulletDirection, this.stats.attackSpeed)
    }
  }
}

export { Enemy }