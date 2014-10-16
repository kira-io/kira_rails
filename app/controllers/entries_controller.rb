class EntriesController < ApplicationController
  def index
  end

  def new
    @user = current_user
    @content = params[:content] if params[:content]
  end

  def create
    @user = current_user
    @entry = @user.entries.new(entry_params)
    if @entry.save
      redirect_to "/users/#{@user.id}"
    else
      flash[:errors] = @entry.errors.full_messages
      #sent content from entry if validation fails back to entry#new
      redirect_to new_entry_path(:content => params[:entry][:content])
    end
  end

  def show
  end

  def destroy
  end

  private
    def entry_params
      params.require(:entry).permit(:title, :content)
    end
end
