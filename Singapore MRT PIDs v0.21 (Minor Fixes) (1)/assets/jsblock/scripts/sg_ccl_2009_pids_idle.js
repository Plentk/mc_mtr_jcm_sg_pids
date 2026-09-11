include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM
const HEADER_HEIGHT = 13;

function create(ctx, state, pids) {}

function render(ctx, state, pids) {
    const CENTREX = pids.width / 2;

    Texture.create("Background")
    .texture("jsblock:textures/block/pids/white.png")
    .size(pids.width, pids.height)
    .color(0x2B453B)
    .draw(ctx);
    let pids_arrivals = pids.arrivals()
    let hasPlatform = pids_arrivals != null && pids_arrivals.platforms().size() > 0;
    let platforms = "0";

    Texture.create("Strip")
    .texture("jsblock:textures/block/pids/white.png")
    .size(pids.width, 0.5)
    .pos(0, 13)
    .color(0xFFFF00)
    .draw(ctx);
    Text.create("Destination Text")
    .text("Destination")
    .color(0xFFFFFF)
    .pos(3, 7)
    .stretchXY()
    .scale(0.5)
    .leftAlign()
    .draw(ctx);
    Text.create("Arriving In")
    .text("Arriving In")
    .color(0xFFFFFF)
    .pos(pids.width-3, 7)
    .stretchXY()
    .scale(0.5)
    .rightAlign()
    .draw(ctx);
    if(hasPlatform){
        platforms = pids_arrivals.platforms().get(0).getName();
    }
    Text.create("Platform")
    .text(`Platform ${platforms}`)
    .color(0xFFFF00)
    .pos(CENTREX, 4)
    .scale(0.8)
    .centerAlign()
    .draw(ctx);
    let defaultArrivalRows = 2;
    let customPIDRows = pids.getCustomMessage(3);
    if(parseInt(customPIDRows)>defaultArrivalRows){
        defaultArrivalRows = Math.min(parseInt(customPIDRows),5);
    }
    for(let i=0;i<defaultArrivalRows;i++){
        let rowY = 19+i*12;
        let arrival = pids_arrivals.get(i);
        if(arrival !== null){
            let arriveMin = Math.round((arrival.arrivalTime()-Date.now()-12000)/60000);
            let destoColour = `0xFFFFFF`
            if(arriveMin<=0){
                destoColour = TextUtil.cycleString(`0xFFFFFF|0xFFFF00`, 20);
            }
            if(arrival.terminating()){
                Text.create("Destination")
                .text(TextUtil.cycleString(`請勿登機|DO NOT BOARD`))
                .scale(0.8)
                .size(CENTREX / 0.8 +35, 10)
                .stretchXY()
                .color(destoColour)
                .leftAlign()
                .pos(3, rowY)
                .draw(ctx);
            }else{
                Text.create("Destination")
                .text(TextUtil.cycleString(arrival.destination()))
                .scale(0.8)
                .size(CENTREX / 0.8 +35, 10)
                .stretchXY()
                .color(destoColour)
                .leftAlign()
                .pos(3, rowY)
                .draw(ctx);
            }
            if(arriveMin <= 0){
                arriveMin = `|Arr`;
                Text.create("Time")
                .text(TextUtil.cycleString(arriveMin))
                .scale(0.8)
                .color(TextUtil.cycleString(`0xFFFFFF|0xFFFF00`, 20))
                .rightAlign()
                .pos(pids.width - 3, rowY)
                .draw(ctx);
            } else {
                if (arriveMin === 1){
                    arriveMin = `${arriveMin} 分鐘|${arriveMin} min`;
                } else {
                    arriveMin = `${arriveMin} 分鐘|${arriveMin} mins`;
                }
                Text.create("Time")
                .text(TextUtil.cycleString(arriveMin))
                .scale(0.8)
                .color(0xFFFFFF)
                .rightAlign()
                .pos(pids.width - 3, rowY)
                .draw(ctx);
            }
        }
    }
}

function dispose(ctx, state, pids) {}