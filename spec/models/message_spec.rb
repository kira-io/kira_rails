require 'rails_helper'

RSpec.describe Message, :type => :model do
  before do
    @user = User.create(:alias => 'kobe', :password => 'password', :password_confirmation => 'password')
    @post = Post.create(:title => 'My Amazing Day',
                        :content => 'Something happened and I laughed. I laughed again',
                        :name => 'kira',
                        :user => @user)
    @message = Message.new(:content => 'Wow so amazing', :post => @post)
  end

  it 'should be valid with content and post' do
    expect(@message).to be_valid
  end

  describe 'a message without content' do
    it 'should be invalid if blank' do
      @message.content = ' '
      expect(@message).to_not be_valid
    end
  end

  describe 'a message without post' do
    it 'should be invalid if nil' do
      @message.post = nil
      expect(@message).to be_valid
    end
  end
end
