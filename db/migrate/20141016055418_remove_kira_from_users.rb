class RemoveKiraFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :kira, :boolean
  end
end
