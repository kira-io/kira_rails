require 'rails_helper'

RSpec.describe User, :type => :model do
  before do
    @user = User.new(:alias => 'kobe', :password => 'password', :password_confirmation => 'password')
  end

  it 'should be valid with alias, password, and password confirmation' do
    expect(@user).to be_valid
  end

  describe 'when any fields are not present' do
    it 'should be invalid without alias' do
      @user.alias = ' '
      expect(@user).to_not be_valid
    end

    it 'should be invalid without password' do
      @user.password = ' '
      expect(@user).to_not be_valid
    end

    it 'should be invalid without password confirmation' do
      @user.password_confirmation = ' '
      expect(@user).to_not be_valid
    end
  end

  describe "when email format is invalid" do
    it "should be invalid" do
      addresses = %w[kobe@foo,com kobe kobe.bryant@foo.
                     kobe@bryant_mamba.com kobe@swaggy+p.com]
      addresses.each do |invalid_address|
        @user.email = invalid_address
        expect(@user).not_to be_valid
      end
    end
  end

  describe "when email format is valid" do
    it "should be valid" do
      addresses = %w[user@foo.COM A_US-ER@f.b.org frst.lst@foo.jp a+b@baz.cn]
      addresses.each do |valid_address|
        @user.email = valid_address
        expect(@user).to be_valid
      end
    end
  end
end
