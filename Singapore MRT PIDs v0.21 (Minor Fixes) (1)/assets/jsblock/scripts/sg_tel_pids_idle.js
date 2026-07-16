include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM
const HEADER_HEIGHT = 13;

function create(ctx, state, pids) {
    print("SG TEL 2019 PID Initialising");  // Only for testing, can remove
}

function render(ctx, state, pids) {
    
    const CENTREX = pids.width / 2;

    let pids_arrivals = pids.arrivals();
    let hasPlatform = pids_arrivals != null && pids_arrivals.platforms().size() > 0;
    let platforms = "0";

    if (hasPlatform) {
        Texture.create("Background")
        .texture("jsblock:textures/block/pids/pids_tel_idle_2019.png")
        .size(pids.width, pids.height)
        .draw(ctx);
        platforms = pids_arrivals.platforms().get(0).getName();

        Text.create("Platform")
        .text(TextUtil.cycleString(`${platforms}月台|Platform ${platforms}`))
        .color(0xFFFFFF)
        .pos(3, 3.5)
        .scale(0.5)
        .wrapText()
        .leftAlign()
        .draw(ctx);
    } else {
        Texture.create("Background")
        .texture("jsblock:textures/block/pids/pids_tel_arr_2019.png")
        .size(pids.width, pids.height)
        .draw(ctx);
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
    
    Text.create("Clock")
    .text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true))
    .color(0xFFFFFF)
    .pos(pids.width - 3, 3.5)
    .scale(0.5)
    .wrapText()
    .rightAlign()
    .draw(ctx);
    
    let customMsg = pids.getCustomMessage(0);
    if (customMsg == "") {
        customMsg = "Thomson-East Coast Line next train arrival screen by the Land Transport Authority Singapore, Implemented in Minecraft Transit Railways Joban Client Mod Passenger Information Display by plentk.sg";
    }
    Text.create("Announcement")
    .text(TextUtil.cycleString(customMsg))
    .color(0xFFFFFF)
    .pos(30, 3.5)
    .size((2 * pids.width) - 100, 7.5)
    .marquee()
    .scale(0.5)
    .leftAlign()
    .draw(ctx);
    

    if (!hasPlatform) {
        Text.create("Destination")
        .text("No Train Services at this Platform")
        .scale(0.7)
        .size(pids.width / 0.7, 7)
        .stretchXY()
        .color(0xFF0000)
        .leftAlign()
        .pos(3, 28)
        .draw(ctx);
        return
    }
    for(let i = 0; i < 2; i++) {
        let rowY = HEADER_HEIGHT + (i*33.5);
        let customMsg = pids.getCustomMessage(i);
        
        let arrival = pids_arrivals.get(i);
        if(arrival != null && !pids.isRowHidden(i)) {

            let destination = arrival.destination();

            if (!arrival.terminating()) {
                Texture.create("Caplet Background")
                .texture("jsblock:textures/block/pids/caplet_bg.png")
                .pos(3, rowY + 2)
                .size(23.4, 14)
                .draw(ctx);

                Texture.create("Caplet")
                .texture("jsblock:textures/block/pids/caplet.png")
                .color(arrival.routeColor())
                .pos(3, rowY + 2)
                .size(23.4, 14)
                .draw(ctx);
                
                Text.create("End Station Code")
                .text(arrival.routeNumber())
                .bold()
                .color(0xFFFFFF)
                .pos(3 + 11.4, rowY + 6.3)
                .scale(0.75)
                .centerAlign()
                .draw(ctx);

                let destination = arrival.destination();

                Text.create("Destination")
                .text(TextUtil.cycleString(destination))
                .scale(0.7)
                .size(pids.width / 0.7 - 30, 7)
                .stretchXY()
                .bold()
                .color(0xFFFFFF)
                .leftAlign()
                .pos(3, rowY + 20)
                .draw(ctx);
            } else {
                Text.create("Destination")
                .text(TextUtil.cycleString(`請勿登機|DO NOT BOARD`))
                .scale(0.7)
                .size(pids.width / 0.7, 7)
                .stretchXY()
                .bold()
                .color(0xFFFFFF)
                .leftAlign()
                .pos(3, rowY + 20)
                .draw(ctx);
                Texture.create("Do Not Board")
                .texture('jsblock:textures/block/pids/tel_misc/dnb.png')
                .pos(3, rowY - 1)
                .size(20, 20)
                .draw(ctx);
            }
            
            let arriveMin = Math.ceil((arrival.arrivalTime() - Date.now()) / (60000));
            
            let eta;

            if(arriveMin <= 0){
                arriveMin = ``;
                eta = "";
            } else if (arriveMin === 1){
                eta = "分鐘|min";
            } else {
                eta = "分鐘|mins";
            }
            Text.create("Time")
            .text(TextUtil.cycleString(arriveMin))
            .scale(1.8)
            .color(0xFFFFFF)
            .bold()
            .rightAlign()
            .pos(pids.width - 3, rowY + 2)
            .draw(ctx);

            Text.create("ETA Text")
            .text(TextUtil.cycleString(eta))
            .scale(0.7)
            .color(0xFFFFFF)
            .rightAlign()
            .pos(pids.width - 3, rowY + 20)
            .draw(ctx);
        }
    }
}

function dispose(ctx, state, pids) {
    print("SG TEL 2019 PIDs Denitionalising......"); // Only for testing, can remove
}