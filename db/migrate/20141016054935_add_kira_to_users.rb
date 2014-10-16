class AddKiraToUsers < ActiveRecord::Migration
  def change
    add_column :users, :kira, :boolean
  end
end
