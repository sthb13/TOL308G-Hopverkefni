class Player extends Actor{
    constructor(x,y){
        super();
        super.setup();
        this.x = x;
        this.y = y;
        
        this.row = x;
        this.column = y;
        // this.pos = pos;
        this.speed = 4; // ~240 px/s
        this.image = g_images.player;
        this.sprite = g_sprites.player;
        this.KEY_LEFT = 'A'.charCodeAt(0);
        this.KEY_RIGHT = 'D'.charCodeAt(0);
        this.KEY_UP = 'W'.charCodeAt(0);
        this.KEY_DOWN = 'S'.charCodeAt(0);
        this.KEY_HOLE_LEFT = 'J'.charCodeAt(0);
        this.KEY_HOLE_RIGHT = 'K'.charCodeAt(0);
        this.ANIM = {RIGHT:[0,1,2],LEFT:[3,4,5], UP: [6,7], DOWN: [7,6],FALL: [8,8], ROPE_RIGHT:[9,10,11], ROPE_LEFT:[12,13,14]};
        this.sprites = this.generateSprites(this.ANIM.RIGHT);
        this.csf = 0; //currentSpriteFrame
        this.dir = DIRECTION.RIGHT;
        this.dirPrev = DIRECTION.RIGHT;
        this.SPRITEFREQ = 3; // requests next sprite every 3rd update
                             // got this value by visual trial and error
                             // formula at the bottom didn't work as exptected
        this.nextSpriteCounter = this.SPRITEFREQ;
        this.type = BLOCKTYPE.PLAYER_SPAWN;
        this.timeDigging = 0;
        
        //TODO: Remove this debug stuff
        this.isPlayer = true;
    }


    update(du){

        spatialManager.unregister(this);
        this.nextSpriteCounter -= du;
        this.dirPrev = this.dir;
        this.prevState = this.state;
        
        // track surroung blocks
        this.blocks = this.surroundingBlocks(this.row,this.column);

        if(this.state == STATE.FALLING || this.state == STATE.LANDING) this.fallingDown(du);

        if(keys[this.KEY_UP] || keys[this.KEY_DOWN]) {
            if(keys[this.KEY_DOWN] && keys[this.KEY_UP]) {
                //Do Nothing
            } else if(this.state != STATE.DIGGING) {
                if(keys[this.KEY_DOWN]) this.move(du, DIRECTION.DOWN);
                if(keys[this.KEY_UP]) this.move(du, DIRECTION.UP);
            }
        } else {
            if(keys[this.KEY_LEFT] && keys[this.KEY_RIGHT]) {
                //Do nothing
            } else if(this.state != STATE.DIGGING) {
                if(keys[this.KEY_LEFT]) this.move(du, DIRECTION.LEFT);
                if(keys[this.KEY_RIGHT]) this.move(du, DIRECTION.RIGHT);
            }
            
        }

        if(this.state = STATE.DIGGING) {this.timeDigging += du}

        this.state = this.checkState();
        this.correctPosition();
        Entity.prototype.setPos(this.x,this.y);

        if(this.state != STATE.DIGGING && this != STATE.FALLING) {
            if(keys[this.KEY_HOLE_LEFT] && gLevel[this.row+1][this.column-1] == BLOCKTYPE.BREAKABLE) {
                this.state = STATE.DIGGING;
                this.timeDigging = 0;
                entityManager._holes.push(new Hole(this.column-1,this.row+1));
                }
    
            if(keys[this.KEY_HOLE_RIGHT] && gLevel[this.row+1][this.column+1] == BLOCKTYPE.BREAKABLE) {
                this.state = STATE.DIGGING;
                this.timeDigging = 0;
                entityManager._holes.push(new Hole(this.column+1,this.row+1));
                }
        }

        
        // this.row = Math.floor(this.y/GRID_BLOCK_H);
        // this.column = Math.floor(this.x/GRID_BLOCK_W);
        this.row = Math.round(this.y/GRID_BLOCK_H);
        this.column = Math.round(this.x/GRID_BLOCK_W);
        // this.row = Math.ceil(this.y/GRID_BLOCK_H);
        // this.column = Math.ceil(this.x/GRID_BLOCK_W);

         spatialManager.register(this);

        this.checkCollision();
        // console.log(spatialManager.checkCollision(this.x,this.y));
         // this.debug();
    }



}
