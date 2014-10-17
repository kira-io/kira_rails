class PostsController < ApplicationController
  before_action :require_signin
  def index
    @posts = Post.all
    @user = current_user

    if @user.kira == true
      @tmp_alias = "kira"
    else
      @tmp_alias = @user.alias
    end
  end

  def new
  end

  def create
  end

  def show
    @post = Post.find(params[:id])
    @user = current_user

    if @user.kira == true
      @tmp_alias = "kira"
    else
      @tmp_alias = @user.alias
    end
  end

  def destroy
  end
end
