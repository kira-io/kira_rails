class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.authenticate(params[:session][:alias], params[:session][:password])
    if user.nil?
      flash[:login_error] = "Couldn't find a user with those credentials"
      redirect_to new_sessions_path
    else
      sign_in user
      redirect_to user
    end
  end

  def destroy
    reset_session
    redirect_to "/signin"
  end
end
