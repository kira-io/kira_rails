class MessagesController < ApplicationController
  def index
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
      redirect_to "/posts/#{@post.id}"
    else
      flash[:errors] = @message.errors.full_messages
      #sent content from message if validation fails back to message#new
      redirect_to new_post_message_path(:content => params[:post][:content])
    end
  end

  def show
  end

  def destroy
  end
end
