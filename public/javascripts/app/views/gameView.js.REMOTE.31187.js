ht.Views.GameView = Backbone.View.extend({

  className: 'game',

  initialize: function() {
    // on enter game, trigger enterGame event and send data to dispatcher to talk through socket
    ht.dispatcher.trigger('enterGame', {playerId: this.options.user.id, gameId: this.model.id});

    // create reference to current player in game model's players array
    this.myPlayer = ht.Helpers.getMyPlayer(this.model, this.options.user.id);
    this.render();

    _.bindAll(this, 'mediaSelect');
    ht.dispatcher.on('mediaSelect', this.mediaSelect);
  },

  render: function() {
    this.$el.empty();
    this.$el.append(new ht.Views.GameHeaderView({ model: this.model }).el);
    if(this.myPlayer.isJudge){
      this.subView = new ht.Views.JudgeView({ model: this.model, myPlayer: this.myPlayer });
      this.$el.append(this.subView.el);
    } else {
      this.subView = new ht.Views.PlayerView({ model: this.model, user: this.options.user, myPlayer: this.myPlayer });
      this.$el.append(this.subView.el);
    }
  },

  mediaSelect: function(submissionUrl, type, hashtag) {
    console.log(submissionUrl, hashtag);
    var players = this.model.get('players');
    for (var i = 0; i < players.length; i++) {
      if (players[i].username === this.options.user.attributes.username) {
        players[i].submitted = true;
        players[i].submission = {url: submissionUrl, type: type, hashtag: hashtag};
      }
    }
    this.model.set('players', players);
    this.model.save();
    this.subView.render();
  }

});