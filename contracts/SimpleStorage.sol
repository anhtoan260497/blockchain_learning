// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract SimpleStorage {
    uint256 public myFavoriteNumber;

    Person[] public Persons;

    mapping(string => uint256) public PersonToFavoriteNumber;

    struct Person {
        string name;
        uint256 favoriteNumber;
    }

    function store(uint256 _myFavoriteNumber) public {
        myFavoriteNumber = _myFavoriteNumber;
    } 

    function retrieve() public view returns(uint256) {
        return myFavoriteNumber;
    }

    function  addPerson(string memory _name, uint256 _favroriteNumber ) public {
        Persons.push(Person(_name, _favroriteNumber));
        PersonToFavoriteNumber[_name] = _favroriteNumber;

    }
}