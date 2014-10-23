class EntriesController < ApplicationController
  def index
    entries = current_user.entries
    entry_location = EntryLocation.all
    render json: { entries: entries, location: entry_location }
  end

  def new
    @user = current_user

    if @user.kira == true
      @tmp_alias = "kira"
    else
      @tmp_alias = @user.alias
    end
    @content = params[:content] if params[:content]
  end

  def create
    @user = current_user
    location = "89.238.130.247" #=> request.remote_ip for production
    @location = Location.create(:ip_address => location)
    @entry_location = EntryLocation.create(:ip_address => location)
    @entry = @user.entries.new(title: params[:entry][:title], content: params[:entry][:content], entry_location: @entry_location)

    if @user.kira == true
      @post = @user.posts.create(title: params[:entry][:title], content: params[:entry][:content], name: "kira", location: @location)  

    else
      @post = @user.posts.create(title: params[:entry][:title], content: params[:entry][:content], name: @user.alias, location: @location)     
    end

    if @entry.save
      redirect_to "/posts"
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
