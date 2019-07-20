App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("LandContract.json", function(landcontract) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.LandContract = TruffleContract(landcontract);
      // Connect provider to interact with contract
      App.contracts.LandContract.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

   // Load contract data
    App.contracts.LandContract.deployed().then(function(instance) {
      landInstance = instance;
      return landInstance.onSaleCount();
    }).then(function(count){

      var allPlots= $("#allPlots");
      allPlots.empty();

      count.forEach(myFunction);
      function myFunction(i){
        if (i>0){
          landInstance.plots(i-1).then(function(plot){
      
          var name=plot[4];
          var price=plot[3];
          var location=plot[5];

          //Render Result
          var plotTemplate="<tr><th>"+name+"</th><td>"+price+"</td><td>"+location+"</td></tr>"
          allPlots.append(plotTemplate);
        });
        }

      }
      // $("#allPlots").html(names.toString());
    //   return landInstance.onSalePrice();
    // }).then(function(price){
    //     $("#allPlotsPrice").html(price[0].toString());
    //     return landInstance.onSaleLocation();
      }).then(function(location){
        $("#allPlotsLocation").html(location);
        return landInstance.myPlotsCount();
      }).then(function(count){

        var myPlots= $("#myPlots");
        myPlots.empty();

        count.forEach(myFunction);
        function myFunction(i){
          if (i>0){
          landInstance.plots(i-1).then(function(plot){
            var name=plot[4];
            var price=plot[3];
            var location=plot[5];
            var forsale=plot[2];

            //Render Result
            var plotTemplate="<tr><th>"+name+"</th><td>"+price+"</td><td>"+location+"</td><td>"+forsale+"</td></tr>"
            myPlots.append(plotTemplate);
          });
          }

        }



      loader.hide();
      content.show();


      // var plotOwners =(instance.getPlots()).then(response => { return response[0]}).then(obj => {return obj[0]});
      //
      // var price = (landInstance.getPlots()).then(response => {return response[2]});
      // var forSaleCheck = (landInstance.getPlots()).then(response => {return response[1]});
      // var ForSaleOwnerList = [];
      // var ForSalePriceList = [];
      //
      //
      // for (var i = 0; i < forSaleCheck.length ; i++) {
      //     if (forSaleCheck[i] === true) {
      //       ForSaleOwnerList.append(plotOwners[i]);
      //       ForSalePriceList.append(price[i]);
      //     }
      // }
      //



      // for (var i = 0; i < noOfPlots; i++) {
      //   landInstance.plots(i).then(function(plot) {
      //     var owner = plot[0];
      //     var forSale = plot[1];
      //     var price = plot[2];

      //     // Render candidate ballot option

      //     var plotDetails = '<li class="list-group-item">' + owner + "   ----   " + forSale + "   -----   " + price + "</li>"
      //     plotList.append(plotDetails);
      //   });
      // }


      // return landInstance.candidatesCount();
    }).catch(function(error) {
      console.warn(error);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
