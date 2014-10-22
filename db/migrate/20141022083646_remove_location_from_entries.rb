class RemoveLocationFromEntries < ActiveRecord::Migration
  def change
    remove_column :entries, :location, :string
  end
end
