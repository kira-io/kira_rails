class UsersController < ApplicationController
  def index
  end

  def new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to @user
    else
      flash[:errors] = @user.errors.full_messages
      redirect_to new_user_path
    end
  end

  def show
    @user = User.find(params[:id])
    @entries = @user.entries
  end

  private
    def user_params
      params.require(:user).permit(:alias, :password, :password_confirmation)
    end
end
