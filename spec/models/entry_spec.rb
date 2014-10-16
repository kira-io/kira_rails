require 'rails_helper'

RSpec.describe Entry, :type => :model do
  before do
    @user = User.create(:alias => 'kobe', :password => 'password', :password_confirmation => 'password')
    @entry = Entry.new(:title => 'My Amazing Day',
                       :content => 'Something happened and I laughed. I laughed again',
                       :user => @user)
  end

  it 'should be valid with title, content, and user' do
    expect(@entry).to be_valid
  end

  describe 'an entry without proper title' do
    it 'should be invalid with no title' do
      @entry.title = ' '
      expect(@entry).to_not be_valid
    end

    it 'should be invalid with too short of title' do
      @entry.title = 'x'
      expect(@entry).to_not be_valid
    end
  end

  describe 'an entry without content' do
    it 'should be invalid' do
      @entry.content = ' '
      expect(@entry).to_not be_valid
    end
  end

  describe 'an entry without user' do
    it 'should be invalid' do
      @entry.user = nil
      expect(@entry).to_not be_valid
    end
  end
end
