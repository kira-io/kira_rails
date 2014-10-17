class UsersController < ApplicationController
  before_action :require_signin, except: [:create]
  before_action :require_correct_user, only: [:edit, :update, :destroy]
  def index
    @users = User.all
  end

  def new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      sign_in @user
      redirect_to @user
    else
      flash[:errors] = @user.errors.full_messages
      redirect_to new_user_path
    end
  end

  def show
    count = 0
    @user = current_user
    @entries = @user.entries
    if @user.kira == true
      @tmp_alias = "kira"
    else
      @tmp_alias = @user.alias
    end

    posts = @user.posts
    posts.each do |post|
      count += post.messages.count
    end
    @count = count
  end

  def edit
  end

  def update 
  end

  def destroy
  end

  def messages
    messages = []
    @user = current_user
    posts = @user.posts
    posts.each do |post|
      messages << post.messages unless post.messages.empty?
    end
    @messages = messages.flatten
  end


  private
    def require_correct_user
      @user = User.find(params[:id])
        redirect_to root_url unless current_user?(@user)    
    end

    def user_params
      params.require(:user).permit(:alias, :password, :password_confirmation)
    end
end
