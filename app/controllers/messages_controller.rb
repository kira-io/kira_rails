class MessagesController < ApplicationController
  def index
    @user = current_user
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
    @message = @user.messages.new(content: params[:post][:content], post: @post)

    if @message.save
      render json: @message
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
