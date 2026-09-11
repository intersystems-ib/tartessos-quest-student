Class Tartessos.Quest.Boot Extends %RegisteredObject
{

Parameter ADVENTURERNAME = "CHANGE_ME";

ClassMethod GetAdventurerName() As %String
{
    Set ^adventurerName = ..#ADVENTURERNAME

    Return ..#ADVENTURERNAME
}

}
