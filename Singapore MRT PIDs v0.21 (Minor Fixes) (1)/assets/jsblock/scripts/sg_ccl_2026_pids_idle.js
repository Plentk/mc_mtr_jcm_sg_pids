include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM
const HEADER_HEIGHT = 13;

function create(ctx, state, pids) {
    print("SG CCL 2026 PID Initialising");  // Only for testing, can remove
}

function render(ctx, state, pids) {
    
    const CENTREX = pids.width / 2;

    let pids_arrivals = pids.arrivals();
    let hasPlatform = pids_arrivals != null && pids_arrivals.platforms().size() > 0;
    let platforms = "0";

    if (hasPlatform) {
        Texture.create("Background")
        .texture("jsblock:textures/block/pids/pids_ccl_wait_2026.png")
        .size(pids.width, pids.height)
        .draw(ctx);
        platforms = pids_arrivals.platforms().get(0).getName();

        Text.create("Next Train Text")
        .text(TextUtil.cycleString(`${platforms}月台|Platform ${platforms}`))
        .color(0xFFFFFF)
        .pos(3, 3.5)
        .scale(0.5)
        .wrapText()
        .leftAlign()
        .draw(ctx);
    } else {
        Texture.create("Background")
        .texture("jsblock:textures/block/pids/pids_ccl_arr_2026.png")
        .size(pids.width, pids.height)
        .draw(ctx);
        Texture.create("Do Not Board")
        .texture('jsblock:textures/block/pids/dnb.png')
        .pos(CENTREX - 20, 0)
        .size(40, 40)
        .draw(ctx);
        Text.create("Standby Text")
        .text(TextUtil.cycleString(`封閉月台|Platform Closed`))
        .color(0xFFFFFF)
        .pos(CENTREX, 42)
        .centerAlign()
        .scale(1.5)
        .draw(ctx);
        return
    }
    
    Text.create("Waiting Time for Next Train")
    .text(TextUtil.cycleString(`即將抵達|Arriving in`))
    .color(0xFFFFFF)
    .pos(pids.width - 3, 3.5)
    .scale(0.5)
    .stretchXY()
    .rightAlign()
    .draw(ctx);
    
    Text.create("Clock")
    .text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true))
    .color(0xFFFFFF)
    .pos(3, pids.height - 7.5)
    .scale(0.5)
    .wrapText()
    .leftAlign()
    .draw(ctx);
    
    let customMsg = pids.getCustomMessage(0);
    if (customMsg == "") {
        customMsg = "Circle Line New Wayfinding Signage for Stage 6 by the Land Transport Authority Singapore, Implemented in Minecraft Transit Railways Joban Client Mod Passenger Information Display by plentk.sg";
    }
    Text.create("Announcement")
    .text(TextUtil.cycleString(customMsg))
    .color(0xFFFFFF)
    .pos(20, pids.height - 7.5)
    .size((2 * pids.width) - 40, 7.5)
    .marquee()
    .scale(0.5)
    .leftAlign()
    .draw(ctx);
    

    if (!hasPlatform) {
        Text.create("Destination")
        .text("No Train Services at this Platform")
        .scale(0.7)
        .color(0xFF0000)
        .leftAlign()
        .pos(3, 28)
        .draw(ctx);
        return
    }
    for(let i = 0; i < 2; i++) {
        let rowY = HEADER_HEIGHT + (i*27.5);
        let customMsg = pids.getCustomMessage(i);
        
        let arrival = pids_arrivals.get(i);
        if(arrival != null && !pids.isRowHidden(i)) {
            let rawRoute = arrival.routeName();

            let parts;

            let clockwise;

            if (arrival.terminating()){
                clockwise = `請勿登車|DO NOT BOARD`;
            } else if (rawRoute && rawRoute.includes("||")) {
                parts = String(rawRoute).split("||");
                clockwise = `|${parts[1].trim()}`;
            } else {
                let clockwiseStatus = arrival.circularState().toString();
                if (clockwiseStatus.includes("ANTI_CLOCKWISE") || clockwiseStatus.includes("ANTICLOCKWISE")) {
                    clockwise = `環|Anticlockwise Loop`;
                } else if (clockwiseStatus.includes("CLOCKWISE")) {
                    clockwise = `環|Clockwise Loop`;
                } else {
                    clockwise = rawRoute;
                };
            }
            terminating = arrival.circularState().toString() == "NONE";
            

            if (clockwise.toUpperCase().includes("ANTI-CLOCKWISE") || clockwise.toUpperCase().includes("ANTICLOCKWISE")) {
                clockwise = `逆時針${clockwise}`;
            } else if (clockwise.toUpperCase().includes("CLOCKWISE")) {
                clockwise = `順時針${clockwise}`;
            }

            Text.create("Arrival Destination")
            .text(TextUtil.cycleString(clockwise))
            .scale(0.9)
            .size(120, 9)
            .color(0xFFFFFF)
            .marquee()
            .bold()
            .pos(3, rowY+4)
            .draw(ctx);

            let capletPos;
            let routeStatus;
            let rowDestination;
            if (arrival.terminating()) {
            } else if (terminating) {
                routeStatus = TextUtil.cycleString("向|Ends at ");
                rowDestination = TextUtil.cycleString(arrival.destination());
                capletPos = TextUtil.cycleString("11|32");
            } else {
                let stations = arrival.route();
                let curPlatform = arrival.platformId();
                let routeIndex = stations.getPlatformIndex(curPlatform);
                let route = stations.getPlatforms();
                rowDestination = route[routeIndex + 1].getStationName();

                routeStatus =  TextUtil.cycleString("經|Via ");
                capletPos = TextUtil.cycleString("11|15");

            }

            if (!arrival.terminating()) {
                Text.create("Destination")
                .text(TextUtil.cycleString(routeStatus))
                .scale(0.7)
                .color(0xFFFFFF)
                .leftAlign()
                .pos(3, rowY + 15)
                .draw(ctx);

                Texture.create("Caplet Background")
                .texture("jsblock:textures/block/pids/caplet_bg.png")
                .pos(parseInt(capletPos, 10), rowY + 14)
                .size(11.7, 7)
                .draw(ctx);

                Texture.create("Caplet")
                .texture("jsblock:textures/block/pids/caplet.png")
                .color(arrival.routeColor())
                .pos(parseInt(capletPos, 10), rowY + 14)
                .size(11.7, 7)
                .draw(ctx);
            

                if (terminating) {
                    Text.create("End Station Code")
                    .text(arrival.routeNumber())
                    .bold()
                    .color(0xFFFFFF)
                    .pos(parseInt(capletPos, 10) + 5.7, rowY + 16.3)
                    .scale(0.375)
                    .centerAlign()
                    .draw(ctx);
                }

                Text.create("Destination")
                .text(TextUtil.cycleString(rowDestination))
                .scale(0.7)
                .color(0xFFFFFF)
                .leftAlign()
                .pos(parseInt(capletPos, 10) + 12.7, rowY + 15)
                .draw(ctx);
            }
            
            let arriveMin = Math.ceil((arrival.arrivalTime() - Date.now()) / (60000));
            
            let eta;

            if(arriveMin <= 0){
                arriveMin = `|Arr`;
                eta = "";
            } else if (arriveMin === 1){
                eta = "分鐘|min";
            } else {
                eta = "分鐘|mins";
            }
            Text.create("Time")
            .text(TextUtil.cycleString(arriveMin))
            .scale(0.9)
            .color(0xFFFFFF)
            .bold()
            .rightAlign()
            .pos(pids.width - 3, rowY + 4)
            .draw(ctx);

            Text.create("ETA Text")
            .text(TextUtil.cycleString(eta))
            .scale(0.7)
            .color(0xFFFFFF)
            .rightAlign()
            .pos(pids.width - 3, rowY + 15)
            .draw(ctx);
        }
    }
}

function dispose(ctx, state, pids) {
    print("SG CCL 2026 PIDs Denitionalising......"); // Only for testing, can remove
}