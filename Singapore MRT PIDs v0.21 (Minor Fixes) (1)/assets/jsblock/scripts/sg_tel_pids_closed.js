include(Resources.id("jsblock:scripts/pids_util.js")); // Built-in script shipped with JCM
const HEADER_HEIGHT = 13;

function create(ctx, state, pids) {
    print("SG TEL 2019 PID Initialising");
}

function render(ctx, state, pids) {
    const CENTREX = pids.width / 2;

    let pids_arrivals = pids.arrivals();
    let hasPlatform = pids_arrivals != null && pids_arrivals.platforms().size() > 0;
    let platforms = "0";

    Texture.create("Background")
    .texture("jsblock:textures/block/pids/pids_tel_arr_2019.png")
    .size(pids.width, pids.height)
    .draw(ctx);
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

    Text.create("Next Train Text")
    .text(TextUtil.cycleString(`${platforms}月台|Platform ${platforms}`))
    .color(0xFFFFFF)
    .pos(3, 3.5)
    .scale(0.5)
    .wrapText()
    .leftAlign()
    .draw(ctx);
    
    
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
}

function dispose(ctx, state, pids) {
    print("SG TEL 2019 PIDs Denitionalising......");
}