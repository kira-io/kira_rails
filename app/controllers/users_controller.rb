class UsersController < ApplicationController
  def index
    @count = 0
    @posts = User.first.posts
    @posts.each do |post|
      @count += post.messages.count
    end
    render text: @count
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
    def user_params
      params.require(:user).permit(:alias, :password, :password_confirmation)
    end
end
