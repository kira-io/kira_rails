class MessagesController < ApplicationController
  def index
    @user = current_user
    @user.update(:message_seen => true)
    messages = Message.all

    messages.each do |message|
      if Time.now - message.created_at > 86400
        message.destroy
      else
        if Time.now - message.created_at > 72000
          message.update(color: 'p_red')
        elsif Time.now - message.created_at > 43200
          message.update(color: 'p_orange')
        end
      end
    end

    if @user.kira == true
      @tmp_alias = "kira"
    else
      @tmp_alias = @user.alias
    end

  end

  def new
    @post = Post.find(params[:post_id])
    @user = current_user
    if @user.kira == true
      @tmp_alias = "kira"
    else
      @tmp_alias = @user.alias
    end
  end

  def create
    @post = Post.find(params[:post_id])
    @user = @post.user
    @user.update(:message_seen => "false")
    @message = @user.messages.new(content: params[:post][:content], post: @post)

    if @message.save
      render json: @user
    else
      render json: 'error'
    end
  end

  def show
  end

  def destroy
  end

  def get_messages
    puts "hello get_messages"
    user = current_user
    render json: user.messages
  end
end
