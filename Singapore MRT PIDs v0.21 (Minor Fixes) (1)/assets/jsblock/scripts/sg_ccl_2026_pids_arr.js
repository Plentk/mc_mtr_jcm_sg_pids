include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM
const HEADER_HEIGHT = 13;

function create(ctx, state, pids) {
    print("SG CCL 2026 PID Initialising");  // Only for testing, can remove
}

function render(ctx, state, pids) {
    const CENTREX = pids.width / 2;
    const CENTREY = pids.height / 2;

    Texture.create("Background")
    .texture("jsblock:textures/block/pids/pids_ccl_arr_2026.png")
    .size(pids.width, pids.height)
    .draw(ctx);

    let pids_arrivals = pids.arrivals();

    let first_arrival = pids_arrivals.get(0);
    
    if (first_arrival != null) {
        
        let firstRawRoute = first_arrival.routeName();

        let firstParts;

        let first_clockwise;
        
        let loopTextSize = 0.9;
        if (first_arrival.terminating()){
            Texture.create("Do Not Board")
            .texture('jsblock:textures/block/pids/dnb.png')
            .pos(CENTREX - 20, 0)
            .size(40, 40)
            .draw(ctx);
            first_clockwise = `請勿登車|DO NOT BOARD`;
            loopTextSize = 1.5;
        } else if (firstRawRoute && firstRawRoute.includes("||")) {
            firstParts = String(firstRawRoute).split("||");
            first_clockwise = `|${firstParts[1].trim()}`;
        } else {
            let clockwiseStatus = first_arrival.circularState().toString();
            if (clockwiseStatus.includes("ANTI_CLOCKWISE") || clockwiseStatus.includes("ANTICLOCKWISE")) {
                first_clockwise = `環|Anticlockwise Loop`;
            } else if (clockwiseStatus == "CLOCKWISE") {
                first_clockwise = `環|Clockwise Loop`;
            } else {
                first_clockwise = firstRawRoute;
            };
        }
        firstTerminating = first_arrival.circularState().toString() == "NONE";            
        if (!first_arrival.terminating() && firstTerminating && !first_clockwise.toUpperCase().includes("CLOCKWISE")) {
            Texture.create("Caplet")
            .texture("jsblock:textures/block/pids/caplet_bg.png")
            .pos(CENTREX - 23.4, 6)
            .size(46.8, 28)
            .draw(ctx);

            Texture.create("Caplet")
            .texture("jsblock:textures/block/pids/caplet.png")
            .pos(CENTREX - 23.4, 6)
            .color(first_arrival.routeColor())
            .size(46.8, 28)
            .draw(ctx);

            Text.create("End Station Code")
            .text(first_arrival.routeNumber())
            .color(0xFFFFFF)
            .bold()
            .pos(CENTREX, 15)
            .scale(1.5)
            .centerAlign()
            .draw(ctx);
        } else {
            let arr_texture;
            if (first_clockwise.toUpperCase().includes("ANTI-CLOCKWISE") || first_clockwise.toUpperCase().includes("ANTICLOCKWISE")) {
                arr_texture = "jsblock:textures/block/pids/ccl_2026_misc/ccl_loop_acw.png";
                first_clockwise = `逆時針${first_clockwise}`;
                if (!first_clockwise.includes("Loop")) {
                    Texture.create("Loop")
                    .texture("jsblock:textures/block/pids/ccl_2026_misc/ccl_dbg_acw.png")
                    .color(first_arrival.routeColor())
                    .pos(CENTREX - 20, 0)
                    .size(40, 40)
                    .draw(ctx);
                }
            } else if (first_clockwise.toUpperCase().includes("CLOCKWISE")) {
                arr_texture = "jsblock:textures/block/pids/ccl_2026_misc/ccl_loop_cw.png";
                first_clockwise = `順時針${first_clockwise}`;
                if (!first_clockwise.includes("Loop")) {
                    Texture.create("Loop")
                    .texture("jsblock:textures/block/pids/ccl_2026_misc/ccl_dbg_cw.png")
                    .color(first_arrival.routeColor())
                    .pos(CENTREX - 20, 0)
                    .size(40, 40)
                    .draw(ctx);
                }
            }

            
            if (!first_arrival.terminating()) {
                // Draw Loop Texture
                Texture.create("Loop")
                .texture(arr_texture)
                .color(first_arrival.routeColor())
                .pos(CENTREX - 20, 0)
                .size(40, 40)
                .draw(ctx);
            }
        }
        let firstTextColour = "0xFFFFFF";
        if (Math.ceil((first_arrival.arrivalTime() - Date.now()) / 60000) <= 0) {
            firstTextColour = TextUtil.cycleString("0xFFFFFF|0xFFFF00", 20);
        }
        Text.create("Loop Text")
        .text(TextUtil.cycleString(first_clockwise))
        .color(firstTextColour)
        .scale(loopTextSize)
        .pos(CENTREX, 42)
        .centerAlign()
        .bold()
        .draw(ctx);
        
        if (pids.type != "pids_1a" && !first_arrival.terminating()) {
            let firstRowDestination;
            if (firstTerminating) {
                firstRowDestination = TextUtil.cycleString("向|Ends at ") + TextUtil.cycleString(first_arrival.destination());
            } else {
                let stations = first_arrival.route();
                let curPlatform = first_arrival.platformId();
                let routeIndex = stations.getPlatformIndex(curPlatform);
                let route = stations.getPlatforms();
                firstRowDestination = TextUtil.cycleString("經|Via ") + TextUtil.cycleString(route[routeIndex + 1].getStationName());
            }

            Text.create("First Train Destination")
            .text(firstRowDestination)
            .color(0xFFFFFF)
            .pos(CENTREX, 52)
            .scale(0.7)
            .centerAlign()
            .draw(ctx);
        }   
        
        let second_arrival = pids_arrivals.get(1);
        if (second_arrival != null) {
            let secondRawRoute = second_arrival.routeName();

            let secondParts;

            let second_clockwise;

            if (second_arrival.terminating()){
                second_clockwise = `請勿登車|DO NOT BOARD`;
            } else if (secondRawRoute && secondRawRoute.includes("||")) {
                secondParts = String(secondRawRoute).split("||");
                second_clockwise = `|${secondParts[1].trim()}`;
            } else {
                let clockwiseStatus = second_arrival.circularState().toString();
                if (clockwiseStatus.includes("ANTI_CLOCKWISE") || clockwiseStatus.includes("ANTICLOCKWISE")) {
                    second_clockwise = `環|Anticlockwise Loop`;
                } else if (clockwiseStatus == "CLOCKWISE") {
                    second_clockwise = `環|Clockwise Loop`;
                } else {
                    second_clockwise = secondRawRoute;
                };
            }
            

            if (second_clockwise.toUpperCase().includes("ANTI-CLOCKWISE") || second_clockwise.toUpperCase().includes("ANTICLOCKWISE")) {
                second_clockwise = `逆時針${second_clockwise}`;
            } else if (second_clockwise.toUpperCase().includes("CLOCKWISE")) {
                second_clockwise = `順時針${second_clockwise}`;
            }

            Text.create("Next Train Destination")
            .text(TextUtil.cycleString(second_clockwise))
            .color(0xFFFFFF)
            .pos(CENTREX, pids.height - 7.5)
            .size(pids.width / 0.75 - 30, 7.5)
            .stretchXY()
            .scale(0.75)
            .centerAlign()
            .draw(ctx);

            Text.create("Next Train Text")
            .text(TextUtil.cycleString("下班列車|Next Train"))
            .color(0xFFFFFF)
            .pos(3.5, pids.height - 9)
            .scale(0.5)
            .size(26, 10)
            .wrapText()
            .leftAlign()
            .bold()
            .draw(ctx);

            let secondArrivalTime = Math.ceil((second_arrival.arrivalTime() - Date.now()) / 60000);
            
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
            .pos(pids.width - 3.5, pids.height - 7.5)
            .scale(0.5)
            .size(30, 10)
            .stretchXY()
            .rightAlign()
            .draw(ctx);
        }
    } else {
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
    }
}

function dispose(ctx, state, pids) {
    print("SG CCL 2026 PIDs Denitionalising......"); // Only for testing, can remove
}