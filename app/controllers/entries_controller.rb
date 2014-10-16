class EntriesController < ApplicationController
  def index
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
    @entry = @user.entries.new(entry_params)

    if @user.kira == true
      @post = @user.posts.create(title: params[:entry][:title], content: params[:entry][:content], name: "kira")    
    else
      @post = @user.posts.create(title: params[:entry][:title], content: params[:entry][:content], name: @user.alias)     
    end

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
