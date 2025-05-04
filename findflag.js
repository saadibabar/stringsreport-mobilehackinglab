Java.perform(function () {

  //---------------------------------------------HOOK MAIN ACTIVITY FUNCTIONS------------------
  setTimeout(function () {

    Java.choose("com.mobilehackinglab.challenge.MainActivity" , {
      onMatch : function(instance){ 
        console.log("Found instance: "+instance);
        console.log("call KLOW func: " + instance.KLOW());
      },
      onComplete:function(){}

    });
  }, 1000);

  //---------------------------------------------HOOK ACTIVITY2 FUNCTIONS------------------
  setTimeout(function () {
    Java.choose("com.mobilehackinglab.challenge.Activity2" , {
        onMatch : function(instance){ 
          console.log("Found instance: "+instance);
          console.log("cd func: " + instance.cd());
          console.log("native func: " + instance.getflag());
        },
        onComplete:function(){}
      
      });
    }, 5000);

    //---------------------------------------------MEMORY SCAN FOR FLAG------------------
    setTimeout(function () {
      //find libflag.so from modules
      const m = Process.getModuleByName("libflag.so")
      console.log(JSON.stringify(m));
      //console.log(hexdump(m.base,{length:m.size}));

      // scan module memory for flag format 
      const pattern = '4d 48 4c 7b'; // MHL{

      Memory.scan(m.base, m.size, pattern, {
        onMatch(address, size) {
          console.log('Memory.scan() found match at', address,
              'with size', size);
        },
        onComplete() {
          console.log('Memory.scan() complete');
        }
      });
      
      const results = Memory.scanSync(m.base, m.size, pattern);// [{"address":"0x7025edb83fc0","size":4}] 
      console.log("Result:" + JSON.stringify(results));
      const flag_addr = results[0].address;
      console.log(hexdump(flag_addr,{length: 30}));
      console.log("ASCII Flag: " + flag_addr.readCString());

    }, 10000);
  
});
