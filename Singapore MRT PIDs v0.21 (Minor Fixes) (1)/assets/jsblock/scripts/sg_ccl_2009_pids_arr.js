include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM
const HEADER_HEIGHT = 13;

function create(ctx, state, pids) {}

function render(ctx, state, pids) {
    const CENTREX = pids.width / 2;

    Texture.create("Background")
    .texture("jsblock:textures/block/pids/white.png")
    .size(pids.width, pids.height)
    .color(0x03502D)
    .draw(ctx);
    let pids_arrivals = pids.arrivals()
    let hasPlatform = pids_arrivals != null && pids_arrivals.platforms().size() > 0;
    let platforms = "0"

    if(!hasPlatform) {
        Texture.create("Do Not Board")
        .texture('jsblock:textures/block/pids/tel_misc/dnb.png')
        .pos(CENTREX - 20, 0)
        .size(40, 40)
        .draw(ctx);
        Text.create("Standby Text")
        .text(TextUtil.cycleString(`封閉月台|Platform Closed`))
        .color(0xFFFFFF)
        .size(pids.width / 1.5, 15)
        .stretchXY()
        .pos(CENTREX, 42)
        .centerAlign()
        .scale(1.5)
        .draw(ctx);
        return
    }

    let first_arrival = pids_arrivals.get(0);
    if (first_arrival != null) {
        let first_destination;
        if (first_arrival.terminating()){
            Texture.create("Do Not Board")
            .texture('jsblock:textures/block/pids/tel_misc/dnb.png')
            .pos(CENTREX - 20, 10)
            .size(40, 40)
            .draw(ctx);
            first_destination = `請勿登機|DO NOT BOARD`;
        } else {
            first_destination = first_arrival.destination();
            let first_routeNumber = first_arrival.routeNumber();
            if(first_routeNumber!==''){
                Texture.create("Destination Circle")
                .texture('jsblock:textures/block/pids/plat_circle.png')
                .pos(CENTREX - 16, 4)
                .color(0xE6D00B)
                .size(32, 32)
                .draw(ctx);
                Texture.create("Destination Circle")
                .texture('jsblock:textures/block/pids/plat_circle.png')
                .pos(CENTREX - 15, 5)
                .color(first_arrival.routeColor())
                .size(30, 30)
                .draw(ctx);
                Text.create("Destination Code")
                .text(first_routeNumber)
                .color(0xFFFFFF)
                .bold()
                .pos(CENTREX, 12.5)
                .scale(2.0)
                .size(9, 10)
                .centerAlign()
                .draw(ctx);
            }
        }
        let firstArriveMin = Math.round((first_arrival.arrivalTime()-Date.now()-12000)/60000);
        if(firstArriveMin <= 0){
            Text.create("Destination")
            .text(TextUtil.cycleString(first_destination))
            .scale(1.2)
            .size(pids.width / 1.2 - 5, 20)
            .stretchXY()
            .bold()
            .color(TextUtil.cycleString(`0xFFFFFF|0xFFFF00`))
            .centerAlign()
            .pos(CENTREX, 40)
            .draw(ctx);
        }else{
            Text.create("Destination")
            .text(TextUtil.cycleString(first_destination))
            .scale(1.5)
            .size(pids.width / 1.5 - 5, 20)
            .stretchXY()
            .bold()
            .color(0xFFFFFF)
            .centerAlign()
            .pos(CENTREX, 40)
            .draw(ctx);
        }
    }
    let second_arrival = pids_arrivals.get(1);
    if(second_arrival != null){
        Text.create("Next Train Text")
        .text(TextUtil.cycleString("下班列車|Next Train"))
        .color(0xFFFFFF)
        .pos(3.5, pids.height - 10)
        .scale(0.5)
        .size(26, 12)
        .wrapText()
        .leftAlign()
        .bold()
        .draw(ctx);
        let second_destination;
        if (second_arrival.terminating()){
            second_destination = `請勿登車|DO NOT BOARD`;
        } else {
            second_destination = second_arrival.destination()
        }
        Text.create("Next Train Destination")
        .text(TextUtil.cycleString(second_destination))
        .color(0xFFFFFF)
        .pos(30, pids.height - 9)
        .size(pids.width-30, 10)
        .scale(0.8)
        .stretchXY()
        .leftAlign()
        .draw(ctx);
        let secondArrivalTime = Math.round((second_arrival.arrivalTime()-Date.now()-12000)/60000);
            
        if(secondArrivalTime <= 0){
            secondArrivalTime = TextUtil.cycleString(`|Arr`);
        } else if (secondArrivalTime === 1){
            secondArrivalTime = secondArrivalTime + TextUtil.cycleString("分鐘|min");
        } else {
            secondArrivalTime = secondArrivalTime + TextUtil.cycleString("分鐘|min");
        }
        
        Text.create("Waiting Time for Next Train")
        .text(secondArrivalTime)
        .color(0xFFFFFF)
        .pos(pids.width - 3.5, pids.height - 9)
        .scale(0.8)
        .size(30, 10)
        .stretchXY()
        .rightAlign()
        .draw(ctx);
    }
}

function dispose(ctx, state, pids) {}