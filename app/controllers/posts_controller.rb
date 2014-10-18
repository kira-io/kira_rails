class PostsController < ApplicationController
  before_action :require_signin
  def index

    posts = Post.all

    @current_posts = [];

    posts.each do |post|
      if Time.now - post.created_at > 86400
        post.destroy
      else
        if Time.now - post.created_at > 72000
          post.update(color: 'p_red')
        elsif Time.now - post.created_at > 43200
          post.update(color: 'p_orange')
        end
        @current_posts << post
      end
    end

    puts @current_posts

    user = current_user


    if user.kira == true
      @tmp_alias = "kira"
    else
      @tmp_alias = user.alias
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

  def get_posts
    posts = Post.all
    render json: posts
  end
end
