Java.perform(function () {
    var Intent = Java.use("android.content.Intent");
    var Uri = Java.use("android.net.Uri");
    var MainActivity = Java.use("com.mobilehackinglab.challenge.MainActivity");
    var Activity2 = Java.use("com.mobilehackinglab.challenge.Activity2");

    // ---- Hook MainActivity ----
    MainActivity.onCreate.overload('android.os.Bundle').implementation = function (savedInstanceState) {
        console.log("[*] MainActivity onCreate triggered");
        this.onCreate(savedInstanceState);

        try {
            console.log("[*] Calling KLOW(): " + this.KLOW());

            // Use this.getApplicationContext() — it's safe now
            var context = this.getApplicationContext();
            var intent = Intent.$new();
            var uri = Uri.parse("mhl://labs/bWhsX3NlY3JldF8xMzM3");

            intent.setAction(Intent.ACTION_VIEW.value);
            intent.setData(uri);
            intent.setClassName("com.mobilehackinglab.challenge", "com.mobilehackinglab.challenge.Activity2");
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK.value); // just in case

            console.log("[*] Launching Activity2 via intent...");
            context.startActivity(intent);

        } catch (e) {
            console.log("[!] Error in MainActivity onCreate: " + e);
        }
    };

    // ---- Hook Activity2 ----
    Activity2.onCreate.overload('android.os.Bundle').implementation = function (savedInstanceState) {
        console.log("[*] Activity2 onCreate triggered");
        this.onCreate(savedInstanceState);

        try {
            console.log("[*] cd(): " + this.cd());
            console.log("[*] getflag(): " + this.getflag());
        } catch (e) {
            console.log("[!] Error in Activity2 methods: " + e);
        }
    };

    // ---- Memory Scan ----
    setTimeout(function () {
        try {
            var m = Process.getModuleByName("libflag.so");
            console.log("[*] Scanning libflag.so...");

            var pattern = '4d 48 4c 7b'; // MHL{
            var results = Memory.scanSync(m.base, m.size, pattern);

            if (results.length > 0) {
                var flag_addr = results[0].address;
                console.log("[*] Flag address: " + flag_addr);
                console.log(hexdump(flag_addr, { length: 64 }));
                console.log("[*] Flag: " + flag_addr.readCString());
            } else {
                console.log("[!] No flag found in memory");
            }
        } catch (err) {
            console.log("[!] Memory scan error: " + err);
        }
    }, 7000);
});
