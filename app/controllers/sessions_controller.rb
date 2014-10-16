class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.authenticate(params[:session][:alias], params[:session][:password])
    if user.nil?
      flash[:login_error] = "Invalid alias/password combination"
      redirect_to root_url
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
