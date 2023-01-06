namespace SpriteKind {
    export const BossBody = SpriteKind.create()
    export const BossWeakpoint = SpriteKind.create()
    export const BossMissleWeakPoint = SpriteKind.create()
    export const SpaceRock = SpriteKind.create()
    export const PowerUp = SpriteKind.create()
    export const Mode = SpriteKind.create()
    export const BMissle = SpriteKind.create()
    export const Guard = SpriteKind.create()
}
namespace StatusBarKind {
    export const BossHealth = StatusBarKind.create()
    export const BWPMissle = StatusBarKind.create()
    export const BossWeakpointHealth = StatusBarKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.SpaceRock, function (sprite, otherSprite) {
    otherSprite.destroy(effects.disintegrate, 500)
    scene.cameraShake(4, 500)
    info.changeLifeBy(-1)
    music.bigCrash.play()
})
statusbars.onZero(StatusBarKind.BossHealth, function (status) {
    BossKill = 1
    BMissle_Active = 0
    Boss_Body.destroy(effects.fire, 2000)
    BossBridge.destroy(effects.fire, 2000)
    BossMissle_Weakpoint_1.destroy(effects.fire, 500)
    BossMissle_Weakpoint_2.destroy(effects.fire, 500)
    info.changeScoreBy(50)
    pause(5000)
    game.over(true, effects.starField)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.SpaceRock, function (sprite, otherSprite) {
    sprite.destroy(effects.warmRadial, 100)
    otherSprite.destroy(effects.disintegrate, 500)
    info.changeScoreBy(1)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    Lazer = sprites.createProjectileFromSprite(assets.image`Pulsar Laser`, Ship, 0, -100)
    music.pewPew.play()
    if (DoubleFire && DoubleFire.lifespan > 0) {
        Lazer.x += -5
        Lazer = sprites.createProjectileFromSprite(assets.image`Pulsar Laser`, Ship, 0, -100)
        Lazer.x += 5
    }
})
function SpawnBoss () {
    Boss_Body = sprites.create(assets.image`Kingdom Ship`, SpriteKind.BossBody)
    BossBridge = sprites.create(img`
        f f f f f f f f 
        f 5 5 5 5 5 5 f 
        f 5 5 5 5 5 5 f 
        f 5 5 5 5 5 5 f 
        f 5 5 5 5 5 5 f 
        f 5 5 5 5 5 5 f 
        f 5 5 5 5 5 5 f 
        f f f f f f f f 
        `, SpriteKind.BossWeakpoint)
    BossMissle_Weakpoint_1 = sprites.create(assets.image`Boss Missile`, SpriteKind.BossMissleWeakPoint)
    BossMissle_Weakpoint_2 = sprites.create(assets.image`Boss Missile`, SpriteKind.BossMissleWeakPoint)
    BossBar = statusbars.create(20, 4, StatusBarKind.BossHealth)
    BossBar.value = 500
    BossBar.setColor(5, 2, 10)
    BossBar.attachToSprite(Boss_Body)
    BMissle_Status = statusbars.create(20, 4, StatusBarKind.BWPMissle)
    BMissle_Status2 = statusbars.create(20, 4, StatusBarKind.BWPMissle)
    BMissle_Status.value = 100
    BMissle_Status2.value = 100
    BMissle_Status.attachToSprite(BossMissle_Weakpoint_1)
    BMissle_Status2.attachToSprite(BossMissle_Weakpoint_2)
    Boss_Body.setPosition(80, -10)
    Boss_Body.vy = 20
    Boss_Body.vx = 30
    Boss_Body.setBounceOnWall(true)
    Boss_Body.setStayInScreen(true)
    Boss_Weakpoint_Alignment()
}
function EnemyDeath (EnemyShip: Sprite) {
    EnemyShip.destroy(effects.fire, 500)
    if (Math.percentChance(20)) {
        PowerUp = sprites.create(assets.image`Laser Powerup`, SpriteKind.PowerUp)
        PowerUp.x = EnemyShip.x
        PowerUp.y = EnemyShip.y
        PowerUp.vy = EnemyShip.vy
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.PowerUp, function (sprite, otherSprite) {
    otherSprite.destroy(effects.halo, 100)
    DoubleFire = sprites.create(assets.image`Double Laser Indicator`, SpriteKind.Mode)
    DoubleFire.setPosition(10, 15)
    DoubleFire.lifespan = 5000
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.BMissle, function (sprite, otherSprite) {
    otherSprite.destroy(effects.disintegrate, 500)
    scene.cameraShake(4, 500)
    info.changeLifeBy(-1)
    music.bigCrash.play()
})
statusbars.onZero(StatusBarKind.EnemyHealth, function (status) {
    EnemyDeath(status.spriteAttachedTo())
    info.changeScoreBy(5)
    music.smallCrash.play()
    if (info.score() >= 80) {
        if (BossActive < 1) {
            BossActive = 1
            BMissle_Active = 1
            BossKill = 0
            SpawnBoss()
        }
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.BossWeakpoint, function (sprite, otherSprite) {
    BossBar.value += -5
    sprite.destroy(effects.warmRadial, 100)
    otherSprite.image.replace(5, 2)
    pause(50)
    otherSprite.image.replace(2, 5)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.BossMissleWeakPoint, function (sprite, otherSprite) {
    statusbars.getStatusBarAttachedTo(StatusBarKind.BWPMissle, otherSprite).value += -10
    sprite.destroy(effects.warmRadial, 100)
})
function Boss_Weakpoint_Alignment () {
    BossMissle_Weakpoint_1.setPosition(Boss_Body.x - 26, Boss_Body.y + 16)
    BossMissle_Weakpoint_2.setPosition(Boss_Body.x + 26, Boss_Body.y + 16)
    BossBridge.setPosition(Boss_Body.x, Boss_Body.y + 10)
}
statusbars.onZero(StatusBarKind.BWPMissle, function (status) {
    BMissle_Active = 0
    status.spriteAttachedTo().destroy(effects.fire, 2000)
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy(effects.warmRadial, 100)
    statusbars.getStatusBarAttachedTo(StatusBarKind.EnemyHealth, otherSprite).value += -50
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    EnemyDeath(otherSprite)
    scene.cameraShake(4, 500)
    info.changeLifeBy(-1)
    music.bigCrash.play()
})
let ESStatusbar: StatusBarSprite = null
let EnemyShip: Sprite = null
let SpaceRock: Sprite = null
let BM2: Sprite = null
let BM1: Sprite = null
let PowerUp: Sprite = null
let BMissle_Status2: StatusBarSprite = null
let BMissle_Status: StatusBarSprite = null
let BossBar: StatusBarSprite = null
let DoubleFire: Sprite = null
let Lazer: Sprite = null
let BossMissle_Weakpoint_2: Sprite = null
let BossMissle_Weakpoint_1: Sprite = null
let BossBridge: Sprite = null
let Boss_Body: Sprite = null
let BMissle_Active = 0
let BossKill = 0
let BossActive = 0
let Ship: Sprite = null
effects.starField.startScreenEffect()
Ship = sprites.create(assets.image`SwordFish`, SpriteKind.Player)
Ship.setPosition(86, 103)
controller.moveSprite(Ship, 100, 0)
Ship.setStayInScreen(true)
let Asteroids = [
sprites.space.spaceAsteroid0,
sprites.space.spaceAsteroid1,
sprites.space.spaceAsteroid2,
sprites.space.spaceAsteroid3,
sprites.space.spaceAsteroid4
]
let EnemySpeed = 30
let EnemySpawnTime = 2000
BossActive = 0
BossKill = 0
BMissle_Active = 0
game.onUpdate(function () {
    if (BossActive >= 1) {
        Boss_Weakpoint_Alignment()
    }
})
game.onUpdateInterval(5000, function () {
    EnemySpeed += 5
    EnemySpeed = Math.min(EnemySpeed, 60)
    EnemySpawnTime += -200
    EnemySpawnTime = Math.max(EnemySpawnTime, 500)
})
game.onUpdateInterval(2000, function () {
    if (BossActive >= 1) {
        if (BMissle_Active >= 1) {
            BM1 = sprites.createProjectileFromSprite(img`
                . . . . . 5 . . . . . 
                . . . . 5 4 5 . . . . 
                . . . 5 4 2 4 5 . . . 
                . . . 5 4 2 4 5 . . . 
                . . . 5 4 2 4 5 . . . 
                . . 5 5 4 2 4 5 5 . . 
                . . . 5 5 4 5 5 . . . 
                . . . . 5 5 5 . . . . 
                . . . . . 5 . . . . . 
                `, BossMissle_Weakpoint_1, 0, 50)
            BM2 = sprites.createProjectileFromSprite(img`
                . . . . . 5 . . . . . 
                . . . . 5 4 5 . . . . 
                . . . 5 4 2 4 5 . . . 
                . . . 5 4 2 4 5 . . . 
                . . . 5 4 2 4 5 . . . 
                . . 5 5 4 2 4 5 5 . . 
                . . . 5 5 4 5 5 . . . 
                . . . . 5 5 5 . . . . 
                . . . . . 5 . . . . . 
                `, BossMissle_Weakpoint_2, 0, 50)
            BM1.setKind(SpriteKind.BMissle)
            BM2.setKind(SpriteKind.BMissle)
        }
    }
})
game.onUpdateInterval(1000, function () {
    SpaceRock = sprites.createProjectileFromSide(Asteroids[randint(0, Asteroids.length - 1)], 0, 50)
    SpaceRock.x = randint(0, scene.screenWidth())
    SpaceRock.setKind(SpriteKind.SpaceRock)
})
forever(function () {
    if (BossActive < 1) {
        EnemyShip = sprites.create(assets.image`EnemyShip`, SpriteKind.Enemy)
        EnemyShip.x = randint(20, scene.screenWidth() - 20)
        EnemyShip.y = 0
        EnemyShip.vy = EnemySpeed
        ESStatusbar = statusbars.create(20, 4, StatusBarKind.EnemyHealth)
        ESStatusbar.setColor(5, 2, 10)
        ESStatusbar.value = 100
        ESStatusbar.attachToSprite(EnemyShip)
        pause(EnemySpawnTime)
    }
})
game.onUpdateInterval(500, function () {
    if (BossActive >= 1) {
        if (Boss_Body.y >= 15) {
            Boss_Body.vy = 0
            Boss_Body.vx = 0 - Boss_Body.vx
        }
    }
})
