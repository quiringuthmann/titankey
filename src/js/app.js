
App = {
  web3Provider: null,
  contracts: {},
  init: function() {
    return App.initWeb3();
  },

//Start des Web3 API zu ETH Blockchain
  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },


// Start des Contracts
  initContract: function() {

    //Infos, wie Payable etc werden im Artifact geladen (truffle-compile)
    $.getJSON('TitanKey.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var TitanKeyArtifact = data;
      App.contracts.TitanKey = TruffleContract(TitanKeyArtifact);
      // Set the provider for our contract.
      App.contracts.TitanKey.setProvider(App.web3Provider);
    });
    return App.bindEvents();
  },

bindEvents: function() {
    $(document).on('click', '#transferButton', App.setUserData);
    $(document).on('click', '#getUserData', App.getUserData);
},

getUserData: function(){
  //start instance
    var TitanKeyInstance;
    var _titanNameAsk = $('#_titanNameAsk').val();

    web3.eth.getAccounts(
        function(error, accounts) {
            if (error) {console.log(error);}
            var account = accounts[0];

            App.contracts.TitanKey.deployed().then(
              function contractGetUserData (instance) {
                TitanKeyInstance = instance;

                return TitanKeyInstance.isNameOwned(_titanNameAsk);

              }).then(
                function(result) {
                  console.log(result);
                }).catch(function(err) {
                  console.log(err.message);
                });
          });
  },

  setUserData: function() {
    var TitanKeyInstance;
    var _titanName = $('#inputTitanName').val(); //.val = get current value
    var _cur = $('#currenyPublicKey').val();
    var _curAddress = $('#currency').val();
    var _curName = $('#currencyUserName').val();

    web3.eth.getAccounts(
      function(error, accounts) {
          if (error) {console.log(error);}
          var account = accounts[0];

          App.contracts.TitanKey.deployed().then(
            function _setUserData (instance) {
              TitanKeyInstance = instance;

              return TitanKeyInstance.setUserData(
                _titanName, _cur,_curName ,_curAddress, {from: account});
            }).then(
              function(result) {
                console.log(result);
              }).catch(function(err) {
                console.log(err.message);
              });
            });
          }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});