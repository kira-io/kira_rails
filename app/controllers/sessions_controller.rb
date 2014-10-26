require 'json'

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
      if user.messages.count == 0
        user.message_seen = true
      end
      redirect_to user
    end
  end

  def destroy
    reset_session
    redirect_to "/"
  end

  def world
    @locations = Location.all.to_json
    @location_array = JSON[@locations]
  end
end
