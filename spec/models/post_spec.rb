require 'rails_helper'

RSpec.describe Post, :type => :model do
  before do
    @user = User.create(:alias => 'kobe', :password => 'password', :password_confirmation => 'password')
    @post = Post.new(:title => 'My Amazing Day',
                     :content => 'Something happened and I laughed. I laughed again',
                     :name => 'kira',
                     :user => @user)
  end

  it 'should be valid with title, content, name, user' do
    expect(@post).to be_valid
  end

  describe 'a post without proper title' do
    it 'should be invalid with no title' do
      @post.title = ' '
      expect(@post).to_not be_valid
    end

    it 'should be invalid with too short of title' do
      @post.title = 'x'
      expect(@post).to_not be_valid
    end
  end

  describe 'a post without content' do
    it 'should be invalid' do
      @post.content = ' '
      expect(@post).to_not be_valid
    end
  end

  describe 'a post without user' do
    it 'should be invalid' do
      @post.user = nil
      expect(@post).to_not be_valid
    end
  end

  describe 'a post without name' do
    it 'should be invalid' do
      @post.name = nil
      expect(@post).to_not be_valid
    end
  end
end
