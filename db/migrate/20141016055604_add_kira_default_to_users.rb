class AddKiraDefaultToUsers < ActiveRecord::Migration
  def change
    add_column :users, :kira, :boolean, :default => true
  end
end
