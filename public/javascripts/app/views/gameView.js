ht.Views.GameView = Backbone.View.extend({

  className: 'game',

  initialize: function() {
    ht.Helpers.delegateCustomEvents(ht.dispatcher, this.dispatcher_events, this);
    this.myPlayer = ht.Helpers.getMyPlayer(this.model, this.attributes.user.id);
    this.joinGame();
    this.render();
  },

  dispatcher_events: {
    'mediaSelect': 'mediaSelect',
    'judgeSelect': 'judgeSelect',
    'continued': 'continued'
  },

  render: function() {
    this.$el.empty();
    if(!this.myPlayer.continued){
      this.subView = new ht.Views.GameEndView({
        model: this.model,
        attributes: {
          myPlayer: this.myPlayer
        }
      });
      this.$el.append(this.subView.el);
    } else {
      this.$el.append(new ht.Views.GameHeaderView({ model: this.model }).el);
      if(this.myPlayer.isJ){
        this.subView = new ht.Views.JudgeView({
          model: this.model,
          attributes: {
            myPlayer: this.myPlayer
          }
        });
        this.$el.append(this.subView.el);
      } else {
        this.subView = new ht.Views.PlayerView({
          model: this.model,
          attributes: {
            user: this.attributes.user,
            myPlayer: this.myPlayer
          }
        });
        this.$el.append(this.subView.el);
      }
    }
  },

  joinGame: function(){
    ht.dispatcher.trigger('joinGame', this.model.get('id'));
  },

  mediaSelect: function(submissionUrl, type, hashtag) {
    var players = this.model.get('players');
    var player = players[this.attributes.user.id];
    debugger;
    player.submitted = true;
    player.submission = {url: submissionUrl, type: type, hashtag: hashtag};
    this.model.set('players', players);
    var selfie = this;
    this.model.save(player, {
      patch: true,
      success: function(){
        selfie.model.fetch({
          success: function (obj, res){
            selfie.model = obj;
            selfie.subView.render();
          },
          error: function (){
            console.log('bummer dude, bad patch');
          }
        });
      },
      error: function(){
        console.error('bummer dude, bad save.');
      }
    });
  },

  judgeSelect: function() {
    var selfie = this;
    this.model.fetch({
      success: function(){
        selfie.myPlayer = ht.Helpers.getMyPlayer(selfie.model, selfie.attributes.user.id);
        selfie.render();
      }
    });
  },

  continued: function() {
    this.myPlayer = ht.Helpers.getMyPlayer(this.model, this.attributes.user.id);
    this.render();
  }

});