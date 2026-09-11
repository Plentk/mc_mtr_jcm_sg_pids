include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM

function create(ctx, state, pids) {}

function render(ctx, state, pids) {
    let CENTREX = pids.width / 2;
    let pids_arrivals = pids.arrivals();
    let hasPlatform = (pids_arrivals != null) && (pids_arrivals.platforms().size() > 0);
    let platforms = "0"

    Texture.create("Background")
    .texture("jsblock:textures/block/pids/pids_dtl_arr_2013.png")
    .size(pids.width, pids.height)
    .draw(ctx);
    
    if (!hasPlatform) {
        Texture.create("Do Not Board").texture('jsblock:textures/block/pids/tel_misc/dnb.png')
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
        let customMsg = pids.getCustomMessage(0);
        if (customMsg == "") {
            customMsg = "This Platform is not in Service, please use the other platforms. Thank you.";
        }
        Text.create("Announcement")
        .text(TextUtil.cycleString(customMsg))
        .color(0xFFFFFF)
        .pos(42, pids.height - 7)
        .size(pids.width - 22, 10)
        .marquee()
        .scale(0.7)
        .leftAlign()
        .draw(ctx);
        return;
    }
    let first_arrival = pids_arrivals.get(0);
    if(first_arrival != null) {
        if(first_arrival.terminating()){
            Texture.create("Do not board")
            .texture('jsblock:textures/block/pids/tel_misc/dnb.png')
            .pos(CENTREX - 15, -2.5)
            .size(30, 30)
            .draw(ctx);
            Text.create("Destination")
            .text(TextUtil.cycleString(`請勿登機|DO NOT BOARD`))
            .scale(1.2)
            .size(pids.width / 1.2 - 5, 20)
            .stretchXY()
            .bold()
            .color(0xFFFFFF)
            .centerAlign()
            .pos(CENTREX, rowY + 11)
            .draw(ctx);
        } else {
            let firstRouteColour = first_arrival.routeColor();
            if (firstRouteColour!==''){
                Texture.create("Destination Circle")
                .texture('jsblock:textures/block/pids/plat_circle.png')
                .pos(CENTREX - 13, 2.5)
                .size(26, 26)
                .draw(ctx);
                Texture.create("Destination Circle")
                .texture('jsblock:textures/block/pids/plat_circle.png')
                .pos(CENTREX - 12.5, 3)
                .color(first_arrival.routeColor())
                .size(25, 25)
                .draw(ctx);
                Text.create("End Station Code")
                .text(first_arrival.routeNumber())
                .bold()
                .color(0xFFFFFF)
                .pos(CENTREX, 10)
                .size(10, 10)
                .stretchXY()
                .scale(1.5)
                .centerAlign()
                .draw(ctx);
            }
            let first_destination = first_arrival.destination();
            Text.create("Destination")
            .text(TextUtil.cycleString(first_destination))
            .scale(1.2)
            .size(pids.width / 1.2 - 5, 20)
            .stretchXY()
            .bold()
            .color(0xFFFFFF)
            .centerAlign()
            .pos(CENTREX, 32.5)
            .draw(ctx);
        }
        let firstArriveMin = Math.round((first_arrival.arrivalTime()-Date.now()-12000)/60000);
        if(firstArriveMin <= 0){
            firstArriveMin = `|Arrived`;
            Text.create("Time")
            .text(TextUtil.cycleString(firstArriveMin))
            .scale(1.2)
            .color(TextUtil.cycleString(`0xFFFFFF|0xFFFF00`))
            .bold()
            .centerAlign()
            .pos(CENTREX, 46)
            .draw(ctx);
        } else {
            if (firstArriveMin === 1){
                firstArriveMin = `${firstArriveMin} 分鐘|${firstArriveMin} min`;
            } else {
                firstArriveMin = `${firstArriveMin} 分鐘|${firstArriveMin} mins`;
            }
            Text.create("Time")
            .text(TextUtil.cycleString(firstArriveMin))
            .scale(1.2)
            .color(0xFFFFFF)
            .bold()
            .centerAlign()
            .pos(CENTREX, 46)
            .draw(ctx);
        }
    }
    let second_arrival = pids_arrivals.get(1);
    if(second_arrival != null) {
        if(second_arrival.terminating()){
            Texture.create("Do not board")
            .texture('jsblock:textures/block/pids/tel_misc/dnb.png')
            .pos(2, 65)
            .size(10, 10)
            .draw(ctx);
            Text.create("Destination")
            .text(TextUtil.cycleString(`請勿登機|DO NOT BOARD`))
            .scale(1.2)
            .size(pids.width / 1.25 - 60, 10)
            .stretchXY()
            .bold()
            .color(0xFFFFFF)
            .centerAlign()
            .pos(CENTREX, 62.5)
            .draw(ctx);
        } else {
            let secondRouteNumber = second_arrival.routeNumber();
            if (!secondRouteNumber!==''){
                Texture.create("Destination Circle")
                .texture('jsblock:textures/block/pids/plat_circle.png')
                .pos(1.5, 62.5)
                .size(11, 11)
                .draw(ctx);
                Texture.create("Destination Circle")
                .texture('jsblock:textures/block/pids/plat_circle.png')
                .color(second_arrival.routeColor())
                .pos(2, 63)
                .size(10, 10)
                .draw(ctx);
                Text.create("End Station Code")
                .text(second_arrival.routeNumber())
                .bold()
                .color(0xFFFFFF)
                .pos(7, 65)
                .size(10, 10)
                .stretchXY()
                .scale(0.8)
                .centerAlign()
                .draw(ctx);
            }
            let second_destination = second_arrival.destination();
            Text.create("Destination")
            .text(TextUtil.cycleString(second_destination))
            .scale(1.2)
            .size(pids.width/1.2 - 55, 11)
            .stretchXY()
            .bold()
            .color(0xFFFFFF)
            .leftAlign()
            .pos(15, 63.5)
            .draw(ctx);
            
        }
        let secondArriveMin = Math.round((second_arrival.arrivalTime()-Date.now()-12000)/60000);
        if(secondArriveMin <= 0){
            secondArriveMin = `|Arrived`;
            Text.create("Time")
            .text(TextUtil.cycleString(secondArriveMin))
            .scale(1.2)
            .color(TextUtil.cycleString(`0xFFFFFF|0xFFFF00`))
            .bold()
            .rightAlign()
            .pos(pids.width - 3, 63.5)
            .draw(ctx);
        } else {
            if (secondArriveMin === 1){
                secondArriveMin = `${secondArriveMin} 分鐘|${secondArriveMin} min`;
            } else {
                secondArriveMin = `${secondArriveMin} 分鐘|${secondArriveMin} mins`;
            }
            Text.create("Time")
            .text(TextUtil.cycleString(secondArriveMin))
            .scale(1.2)
            .color(0xFFFFFF)
            .bold()
            .rightAlign()
            .pos(pids.width - 3, 63.5)
            .draw(ctx);
        }
    }
}

function dispose(ctx, state, pids) {}