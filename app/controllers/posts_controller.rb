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

    puts @current_posts.inspect

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

  def update_post
    puts params
    post = Post.find(params[:post])
    user = current_user
    if user.joy_counts.count > 23
      output = 'You have given the maximum amount of joys for the day'
    elsif post.joy_counts.find_by(user: user)
      output = 'You have already given this post a joy'
    else
      post.joy_counts.create(user: user)
      post.joys += 1
      post.save
      output = 'success'
    end
    render json: output
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
    location = Location.all
    user = current_user.joy_counts
    render json: {post: posts, user: user, location: location}  
  end
end
