include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM
const HEADER_HEIGHT = 13;

function create(ctx, state, pids) {
    print("SG TEL 2019 PID Initialising");  // Only for testing, can remove
}

function render(ctx, state, pids) {
    const CENTREX = pids.width / 2;
    const CENTREY = pids.height / 2;

    let pids_arrivals = pids.arrivals();
    let hasPlatform = pids_arrivals != null && pids_arrivals.platforms().size() > 0;
    let platforms = "0";

    Texture.create("Background")
    .texture("jsblock:textures/block/pids/pids_tel_arr_2019.png")
    .size(pids.width, pids.height)
    .draw(ctx);

    if (hasPlatform) {
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
        Texture.create("Do Not Board")
        .texture('jsblock:textures/block/pids/tel_misc/dnb.png')
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
            Texture.create("Caplet")
            .texture("jsblock:textures/block/pids/caplet_bg.png")
            .pos(CENTREX - 18.7, 18)
            .size(37.4, 22.4)
            .draw(ctx);

            Texture.create("Caplet")
            .texture("jsblock:textures/block/pids/caplet.png")
            .pos(CENTREX - 18.7, 18)
            .color(first_arrival.routeColor())
            .size(37.4, 22.4)
            .draw(ctx);

            Text.create("End Station Code")
            .text(first_arrival.routeNumber())
            .color(0xFFFFFF)
            .bold()
            .pos(CENTREX, 25.2)
            .scale(1.2)
            .centerAlign()
            .draw(ctx);
        }

        let firstTextColour = "0xFFFFFF";
        if (Math.round((first_arrival.arrivalTime()-Date.now()-12000)/60000) <= 0) {
            firstTextColour = TextUtil.cycleString("0xFFFFFF|0xFFFF00", 20);
        }
        Text.create("Destination Text")
        .text(TextUtil.cycleString(first_destination))
        .color(firstTextColour)
        .scale(1.2)
        .size(pids.width / 1.2, 12)
        .stretchXY()
        .pos(CENTREX, 50)
        .centerAlign()
        .bold()
        .draw(ctx);
        
        let second_arrival = pids_arrivals.get(1);
        if (second_arrival != null) {

            let second_destination;
            if (second_arrival.terminating()){
                second_destination = `請勿登車|DO NOT BOARD`;
            } else {
                second_destination = second_arrival.destination()
            }

            if (!second_arrival.terminating()){
                Texture.create("Caplet")
                .texture("jsblock:textures/block/pids/caplet_bg.png")
                .pos(20, pids.height - 8)
                .size(11.7, 7)
                .draw(ctx);

                Texture.create("Caplet")
                .texture("jsblock:textures/block/pids/caplet.png")
                .pos(20, pids.height - 8)
                .color(second_arrival.routeColor())
                .size(11.7, 7)
                .draw(ctx);

                Text.create("End Station Code")
                .text(second_arrival.routeNumber())
                .color(0xFFFFFF)
                .bold()
                .pos(25.7, pids.height - 5.7)
                .scale(0.375)
                .centerAlign()
                .draw(ctx);

                Text.create("Next Train Destination")
                .text(TextUtil.cycleString(second_destination))
                .color(0xFFFFFF)
                .pos(32.7, pids.height - 7.5)
                .size(pids.width / 0.75 - 67, 7.5)
                .stretchXY()
                .scale(0.75)
                .leftAlign()
                .draw(ctx);
            } else {

                Text.create("Next Train Destination")
                .text(TextUtil.cycleString(second_destination))
                .color(0xFFFFFF)
                .pos(20, pids.height - 7.5)
                .scale(0.75)
                .leftAlign()
                .draw(ctx);
            }

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
            .pos(pids.width - 3.5, pids.height - 7.5)
            .scale(0.5)
            .size(30, 10)
            .stretchXY()
            .rightAlign()
            .draw(ctx);


        }
    
    } else {
        Texture.create("Do Not Board")
        .texture('jsblock:textures/block/pids/tel_misc/dnb.png')
        .pos(CENTREX - 20, 10)
        .size(40, 40)
        .draw(ctx);
        Text.create("Standby Text")
        .text(TextUtil.cycleString(`封閉月台|Platform Closed`))
        .color(0xFFFFFF)
        .pos(CENTREX, 50)
        .centerAlign()
        .scale(1.2)
        .draw(ctx);
    }

}

function dispose(ctx, state, pids) {
    print("SG TEL 2019 PIDs Denitionalising......"); // Only for testing, can remove
}