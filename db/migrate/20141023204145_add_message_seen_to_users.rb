class AddMessageSeenToUsers < ActiveRecord::Migration
  def change
    add_column :users, :message_seen, :boolean, :default => true
  end
end
