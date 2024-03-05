import anime from 'animejs'

export function Dot(id, x, y, w, h, opacity, animationConfig, mouse) {
  this.id = id
  this.x = x
  this.y = y
  this.w = w
  this.h = h
  this.opacity = opacity
  this.anim = animationConfig
  this.isVert = this.anim?.direction === 'vertical'
  // this.endPos = { x: this.anim?.speed * 10 ?? 0, y: this.anim?.speed * 10 ?? 0 }

  this.draw = function (c, clock) {
    c.fillRect(this.x, this.y, this.w, this.h)
    c.fillStyle = `rgba(255,255,255,${this.opacity})`
    c.fill()
  }

  this.update = function (c, clock) {
    // interactivity
    // if (!mouse) return
    const INTERACTIVITY_RADIUS = 100
    if (
      mouse.x - this.x < INTERACTIVITY_RADIUS &&
      mouse.x - this.x > -INTERACTIVITY_RADIUS &&
      mouse.y - this.y < INTERACTIVITY_RADIUS &&
      mouse.y - this.y > -INTERACTIVITY_RADIUS
    ) {
      anime({ target: this, w: '+=20', loop: 'true', direction: 'alternate' })
      // if (this.w < 10) {
      //   this.w += 1
      //   this.h += 1
      //   console.log('growing', this.id, this.w)
      // }
    }
    // } else if (this.w > 2) {
    //   this.w -= 1
    //   this.h -= 1
    // }

    this.draw(c, clock)
  }
}
