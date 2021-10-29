class CycleSpacesArray
{
    constructor()
    {
        this.array1 = [];
        this.array2 = []; 
        this.ids = [];
        this.updated = [];
    }

    add( id )   
    {
        let checkIfAdded =  this.ids.indexOf( id ); 
        if( checkIfAdded !== -1)
        {
            return -1; //this has already been added
        }

        let id_index = this.ids.length;
        this.ids.push( id );
        this.updated.push(false); 

        if( this.array1.length <= this.array2.length )
        {
            this.array1.push( id_index ); 
        }
        else 
        {
            this.array2.push( id_index ); 
        }
        
        if( this.array1.length === this.array2.length )
        {
            return [ this.ids[ this.ids.length-1, this.ids.length-2 ] ];
        }
        else return []; 
    }

    cycle()
    {
        if( this.ids.length <= 2 )
        {
            this.resetUpdated(); //still reset updated so we can connect again.
            return; //don't cycle if only 2 people are connecting
        }

        let move1To2 = this.array1[this.array1.length-1]; //last one is displaced
        let move2To1 = this.array2[0]; //1st one is displaced

        //move 1st array
        for( let i=this.array1.length-1; i>0; i-- )
        {
            this.array1[i] = this.array1[i-1];
        }
        this.array1[0] = move2To1;

        //move 2nd array
        for(let i=0; i<this.array2.length-1; i++)
        {
            this.array2[i] = this.array2[i+1]; 
        }
        this.array2[this.array2.length-1] = move1To2;

        this.resetUpdated();
    }

    logArrays()
    {
        console.log("******");
        console.log( this.array1 );
        console.log( this.array2 );
        console.log( this.ids );
        console.log( this.updated );
        console.log("******");
    }

    getCurrentPairs()
    {
        let curPairs = []; 
        if( this.array1.length > 0 && this.array2.length > 0 )
        {
            for(let i=0; i<this.array2.length; i++) //array2 will always be shorter
            {
                curPairs.push( {ids:[this.ids[ this.array1[i] ], this.ids[ this.array2[i] ] ] });
            }
        }
        return curPairs;
    }

    //if there is not a partner or if doesn't need to be updated, -1
    //else, return id to connect 
    connectToNewSpace( askingID )
    {
        let askingIndex = this.ids.indexOf( askingID ); 
        if( askingIndex === -1 )
        {
            return -2; //not found in the ids, so add.
        }
        
        //connection has been updated so don't reconnect
        if( this.updated[ askingIndex ] )
        {
            return -1; 
        }
        else
        {
            let pairIndex; 
            let whichArray; 
            let indexInArray1  = this.array1.indexOf( askingIndex ); 
            if( indexInArray1 != -1 ){
                if( indexInArray1 >= this.array2.length )
                {
                    //no partner yet :( 
                    return "0"; 
                }
                pairIndex = indexInArray1; 
                whichArray = this.array2; 
            }
            else
            {
                pairIndex =  this.array2.indexOf( askingIndex ); 
                whichArray = this.array1; 
            }
            let index = whichArray[ pairIndex ];
            this.updated[ index ] = true; 
            this.updated[ askingIndex ] = true; 
            return this.ids[ index ]; //OK! new connection
        }
    }

    //handle removal
    remove( id )
    {
        console.log("removing: " + id);

        let indexToRemove = this.ids.indexOf( id ); 
        if( indexToRemove === -1 )
        {
            return; 
        }

        //find index in the arrays & remove
        let arrayIndex = this.array1.indexOf( indexToRemove ); 
        if( arrayIndex !== -1  )
        {
            this.array1.splice( arrayIndex, 1 )
        }
        else
        {
            arrayIndex = this.array2.indexOf( indexToRemove );
            if( arrayIndex !== -1  ) 
            {
                this.array2.splice( arrayIndex, 1 )
            }
        }

        //adjust the indices 
        for( let i=0; i<this.array1.length; i++ )
        {
            if( this.array1[i] > indexToRemove )
                this.array1[i]--; 
        }
        for( let i=0; i<this.array2.length; i++ )
        {
            if( this.array2[i] > indexToRemove )
                this.array2[i]--; 
        }

        //reallocate btw array 1 & 2 in the 2 cases which will mess things up
        if( this.array1.length < this.array2.length )
        {
            this.array1.push( this.array2[0] );
            this.array2.splice( 0, 1 );
        }
        else if( this.array1.length >= this.array2.length + 2)
        {
            this.array2.push( this.array1[ this.array1.length-1 ] );
            this.array1.splice( this.array1.length-1, 1 );
        }

        this.ids.splice( indexToRemove, 1 );
        this.updated.splice( indexToRemove, 1  ); 

        this.resetUpdated(); //reconnect all just in case
    }

    resetUpdated()
    {
        //update all connections for now, its cool
        for( let i=0; i<this.updated.length; i++ )
        {                    
            this.updated[i] = false;
        }
    }

    reset()
    {
        this.array1 = [];
        this.array2 =[];
        this.ids =[];
        this.updated =[];
    }


}

module.exports.CycleSpacesArray = CycleSpacesArray;