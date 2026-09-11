include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM

function create(ctx, state, pids) {}

function render(ctx, state, pids) {
    const CENTREX = pids.width/2;
    Texture.create("Background")
    .texture("jsblock:textures/block/pids/white.png")
    .size(pids.width, pids.height)
    .color(0x822CE1)
    .draw(ctx);
    Texture.create("Line")
    .texture("jsblock:textures/block/pids/white.png")
    .pos(0,23.75)
    .size(pids.width, 0.5)
    .color(0xED2111)
    .draw(ctx);
    Texture.create("Line")
    .texture("jsblock:textures/block/pids/white.png")
    .pos(35.75,0)
    .size(0.5, 24)
    .color(0xED2111)
    .draw(ctx);
    Text.create("Clock")
    .text(PIDSUtil.formatTime(MinecraftClient.worldDayTime(), true)) // Note this here!
    .color(0xFFFFFF)
    .pos(4,4)
    .scale(4.0)
    .size(7,5)
    .stretchXY()
    .leftAlign()
    .draw(ctx);
    let pids_arrivals = pids.arrivals()
    let hasPlatform = pids_arrivals != null && pids_arrivals.platforms().size() > 0;
    let platforms = "0";
    if(!hasPlatform){
        Text.create("Next Train text")
        .text("No Trains")
        .pos(CENTREX,30)
        .color(0xFFFFFF)
        .scale(0.8)
        .centerAlign()
        .draw(ctx);
        return
    }
    Text.create("Next Train text")
    .text("Next Train")
    .pos(CENTREX,30)
    .color(0xFFFFFF)
    .scale(0.8)
    .centerAlign()
    .draw(ctx);
    let first_arrival = pids_arrivals.get(0);
    if (first_arrival != null) {
        let firstArriveSec = Math.round((first_arrival.arrivalTime()-Date.now())/1000);
        let firstArriveMin = Math.round((firstArriveSec-20)/60);
        if(firstArriveMin <= 0){
            firstArriveMin = `|Arrived`;
        } else {
            if (firstArriveMin === 1){
                firstArriveMin = `${firstArriveMin} 分鐘|${firstArriveMin} min`;
            } else {
                firstArriveMin = `${firstArriveMin} 分鐘|${firstArriveMin} mins`;
            }
        }
        Text.create("Arrival Time")
        .text(TextUtil.cycleString(firstArriveMin))
        .pos(CENTREX,40)
        .color(0xFFFFFF)
        .scale(2.0)
        .centerAlign()
        .draw(ctx);
        if(first_arrival.terminating()){
            Text.create("Destination")
            .text(TextUtil.cycleString(`請勿登機|DO NOT BOARD`))
            .pos(CENTREX,60)
            .size(pids.width/1.3,10)
            .color(0xFFFFFF)
            .scale(1.3)
            .stretchXY()
            .centerAlign()
            .draw(ctx);
        }else{
            Text.create("Destination")
            .text(TextUtil.cycleString(first_arrival.destination()))
            .pos(CENTREX,60)
            .size(pids.width/1.3-5,10)
            .color(0xFFFFFF)
            .scale(1.3)
            .stretchXY()
            .centerAlign()
            .draw(ctx);
        }
        let pidAnnouncement = pids.getCustomMessage(0);
        if(pidAnnouncement==''){
            let pidStation = pids.station();
            if(pidStation != null){
                pidAnnouncement = `Welcome to ${TextUtil.getNonCjkAndExtraParts(pids.station().getName())} station! We hope you'll have a pleasant journey with us.`;
            }else{
                pidAnnouncement = `Welcome onboard! We hope you'll have a pleasant journey with us.`;
            }
        }
        Text.create("Announcement")
        .text(pidAnnouncement)
        .pos(38,1)
        .size(190,100)
        .color(0xFFFFFF)
        .scale(0.5)
        .wrapText()
        .leftAlign()
        .draw(ctx);
    }
    
}

function dispose(ctx, state, pids) {}